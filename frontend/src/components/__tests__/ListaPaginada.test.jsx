import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ListaPaginada from "../ListaPaginada";
import { vi } from "vitest";

const mockPagina1 = {
  results: [{ id: 1, name: "Item 1" }],
  next: "url-pagina-2",
  previous: null,
};

const mockPagina2 = {
  results: [{ id: 2, name: "Item 2" }],
  next: null,
  previous: "url-pagina-1",
};

describe("ListaPaginada", () => {
  it("Muestra items, paginación y actualiza con nueva búsqueda", async () => {
    const recuperarDatos = vi
      .fn()
      .mockResolvedValueOnce(mockPagina1)
      .mockResolvedValueOnce(mockPagina2)
      .mockResolvedValueOnce(mockPagina1);

    const renderItem = (item) => <li key={item.id}>{item.name}</li>;

    const { rerender } = render(
      <ListaPaginada
        recuperarDatos={recuperarDatos}
        renderItem={renderItem}
        claveBusqueda="primera clave"
      />
    );

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Siguiente"));
    await waitFor(() => {
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Anterior"));
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    await act(() => {
      rerender(
        <ListaPaginada
          recuperarDatos={recuperarDatos}
          renderItem={renderItem}
          claveBusqueda="segunda clave"
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    expect(recuperarDatos).toHaveBeenCalledTimes(4);
  });

  it("Muestra error al recuperar datos", async () => {
    const recuperarDatos = vi.fn().mockRejectedValueOnce(new Error("Error"));
    const renderItem = (item) => <li key={item.id}>{item.name}</li>;

    render(
      <ListaPaginada recuperarDatos={recuperarDatos} renderItem={renderItem} />
    );

    await waitFor(() => {
      expect(screen.getByText("Cargando...")).toBeInTheDocument();
    });
  });
});
