import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import EditarComentarioPage from "../EditarComentarioPage";
import toast from "react-hot-toast";

const verComentarioMock = vi.fn();
const editarComentarioMock = vi.fn();
const eliminarComentarioMock = vi.fn();
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/comentarios", () => ({
  __esModule: true,
  verComentario: (...args) => verComentarioMock(...args),
  editarComentario: (...args) => editarComentarioMock(...args),
  eliminarComentario: (...args) => eliminarComentarioMock(...args),
}));

// Mock del toast
vi.mock("react-hot-toast", () => {
  return {
    __esModule: true,
    default: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: 1 }),
  };
});

// Mock de la TransicionAnimada
vi.mock("../../components/TransicionAnimada", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children }) => React.createElement("div", null, children),
  };
});

vi.mock("../../components/ComentarioInput", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ textoInicial, onSubmit, onCancel, onDelete, textoBoton }) =>
      React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { "data-testid": "texto-inicial" },
          textoInicial
        ),
        React.createElement(
          "button",
          {
            "data-testid": "submit-btn",
            onClick: () => onSubmit("Nuevo texto de prueba"),
          },
          textoBoton
        ),
        React.createElement(
          "button",
          {
            "data-testid": "cancel-btn",
            onClick: () => onCancel(),
          },
          "Cancelar"
        ),
        React.createElement(
          "button",
          {
            "data-testid": "delete-btn",
            onClick: () => onDelete(),
          },
          "Borrar"
        )
      ),
  };
});

describe("EditarComentarioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
  });

  it("Muestra 'Cargando...' mientras se carga el comentario ", () => {
    verComentarioMock.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando comentario/i)).toBeInTheDocument();
  });

  it("Carga el texto inicial y lo muestra en el input ", async () => {
    verComentarioMock.mockResolvedValue({ texto: "Texto inicial" });

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByText(/Cargando comentario/i)).toBeNull()
    );

    expect(screen.getByTestId("texto-inicial")).toHaveTextContent(
      "Texto inicial"
    );
  });

  it("Editar comentario con éxito, muestra el toast y navega", async () => {
    verComentarioMock.mockResolvedValueOnce({ texto: "Texto inicial" });
    editarComentarioMock.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(editarComentarioMock).toHaveBeenCalledWith(
        1,
        "Nuevo texto de prueba"
      );
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Comentario editado correctamente ✅"
    );

    expect(navigateMock).toHaveBeenCalledWith(-1);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Comentario editado correctamente"
    );
  });

  it("Editar comentario falla, muestra el toast y no navega", async () => {
    verComentarioMock.mockResolvedValueOnce({ texto: "Texto inicial" });
    editarComentarioMock.mockRejectedValueOnce(new Error("fail"));

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(editarComentarioMock).toHaveBeenCalledWith(
        1,
        "Nuevo texto de prueba"
      );
    });

    expect(toast.error).toHaveBeenCalledWith("Error al editar el comentario");

    expect(navigateMock).not.toHaveBeenCalledWith(-1);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Error al editar el comentario"
    );
  });

  it("Borrar comentario con éxito, muestra el toast y navega", async () => {
    verComentarioMock.mockResolvedValueOnce({ texto: "Texto inicial" });
    eliminarComentarioMock.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn"));

    expect(global.confirm).toHaveBeenCalledWith(
      "¿Estás seguro de que quieres borrar este comentario?"
    );

    await waitFor(() => {
      expect(eliminarComentarioMock).toHaveBeenCalledWith(1);
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Comentario borrado correctamente 🔴"
    );

    expect(navigateMock).toHaveBeenCalledWith(-1);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Comentario borrado correctamente"
    );
  });

  it("Cancelar borrar comentario, no llama al servicio y navega", async () => {
    verComentarioMock.mockResolvedValueOnce({ texto: "Texto inicial" });
    global.confirm = vi.fn(() => false);

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn"));

    expect(eliminarComentarioMock).not.toHaveBeenCalled();

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Botón de cancelar navega atrás y no llama al servicio", async () => {
    verComentarioMock.mockResolvedValueOnce({ texto: "Texto inicial" });

    render(
      <MemoryRouter>
        <EditarComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("cancel-btn"));
    fireEvent.click(screen.getByTestId("cancel-btn"));

    expect(editarComentarioMock).not.toHaveBeenCalled();
    expect(eliminarComentarioMock).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
