import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BuscarAsignaturasPage from "../BuscarAsignaturasPage";
import { buscarAsignaturas } from "../../api/asignaturas";

let listaPaginadaProps = {};
const toggleFavoritoMock = vi.fn();
const esFavoritaMock = vi.fn((id) => id === 1);
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/asignaturas", () => ({
  __esModule: true,
  buscarAsignaturas: vi.fn(),
}));

// Mock del contexto de Favoritos
vi.mock("../../context/FavoritosContext", () => ({
  __esModule: true,
  useFavoritos: () => ({
    esFavorita: esFavoritaMock,
    toggleFavorito: toggleFavoritoMock,
  }),
}));

// Mock del contexto de User
vi.mock("../../context/UserContext", () => ({
  __esModule: true,
  useUser: () => ({
    estaLogueado: true,
  }),
}));

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: "/asignaturas/buscar" }),
    Link: ({ to, children, ...rest }) =>
      React.createElement("a", { href: to, ...rest }, children),
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

vi.mock("../../components/ListaPaginada", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props) => {
      listaPaginadaProps = props;
      const items = [
        {
          id_asignatura: 1,
          nombre: "Asignatura de ejemplo 1",
          nombre_grado: "Grado de ejemplo 1",
        },
        {
          id_asignatura: 2,
          nombre: "Asignatura de ejemplo 2",
          nombre_grado: "Grado de ejemplo 2",
        },
      ];
      return React.createElement(
        "ul",
        { "data-testid": "lista" },
        ...items.map((item) => props.renderItem(item))
      );
    },
  };
});

describe("BuscarAsignaturasPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("No muestra lista hasta pulsar Enter", () => {
    render(
      <MemoryRouter>
        <BuscarAsignaturasPage />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("lista")).toBeNull();
  });

  it("Actualiza el valor de la barra de busqueda y solo busca al pulsar Enter", async () => {
    render(
      <MemoryRouter>
        <BuscarAsignaturasPage />
      </MemoryRouter>
    );

    const busqueda = screen.getByPlaceholderText("Buscar asignatura...");
    fireEvent.change(busqueda, { target: { value: "      test      " } });
    expect(busqueda.value).toBe("      test      ");

    fireEvent.keyDown(busqueda, { key: "a", code: "KeyA" });
    expect(screen.queryByTestId("lista")).toBeNull();

    fireEvent.keyDown(busqueda, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(listaPaginadaProps.claveBusqueda).toBe("test");
      expect(screen.getByTestId("lista")).toBeInTheDocument();
    });
  });

  it("Al escribir y pulsar Enter configura clave y renderiza Lista paginada", async () => {
    render(
      <MemoryRouter>
        <BuscarAsignaturasPage />
      </MemoryRouter>
    );

    const busqueda = screen.getByPlaceholderText("Buscar asignatura...");
    fireEvent.change(busqueda, { target: { value: "gebra" } });
    fireEvent.keyDown(busqueda, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByTestId("lista")).toBeInTheDocument();
      expect(typeof listaPaginadaProps.recuperarDatos).toBe("function");
      expect(listaPaginadaProps.claveBusqueda).toBe("gebra");
      expect(listaPaginadaProps.urlInicial).toBeNull();
      expect(typeof listaPaginadaProps.renderItem).toBe("function");
    });
  });

  it("Enlace y botón que llama a toggleFavorito", async () => {
    const item = {
      id_asignatura: 1,
      nombre: "Asignatura de ejemplo 1",
      nombre_grado: "Grado de ejemplo 1",
    };

    const asignatura = listaPaginadaProps.renderItem(item);
    render(asignatura, { wrapper: MemoryRouter });

    const enlace = screen.getByRole("link", {
      name: /Asignatura de ejemplo 1/i,
    });
    expect(enlace).toHaveAttribute("href", "/asignaturas/1");
    expect(screen.getByText(/Grado de ejemplo 1/i)).toBeInTheDocument();

    const botonFavorito = screen.getByRole("button");
    fireEvent.click(botonFavorito);
    expect(toggleFavoritoMock).toHaveBeenCalledWith(1);
  });

  it("Se muestra el título y el botón de volver atrás", () => {
    render(
      <MemoryRouter>
        <BuscarAsignaturasPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Buscar asignaturas/i })
    ).toBeInTheDocument();

    const atras = screen.getByRole("button", { name: /← volver atrás/i });
    expect(atras).toBeInTheDocument();
    fireEvent.click(atras);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
