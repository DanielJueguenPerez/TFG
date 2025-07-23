import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerListaFavoritosPage from "../VerListaFavoritosPage";
import { verFavoritos } from "../../api/favoritos";

let listaPaginadaProps = {};
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/favoritos", () => ({
  __esModule: true,
  verFavoritos: vi.fn(),
}));

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: "/usuario/favoritos" }),
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
        { id_favorito: 1, id_asignatura: 12, nombre_asignatura: "Asignatura de ejemplo 1" },
        { id_favorito: 2, id_asignatura: 19, nombre_asignatura: "Asignatura de ejemplo 2" },
      ];
      return React.createElement(
        "ul",
        { "data-testid": "lista" },
        ...items.map((item) => props.renderItem(item))
      );
    },
  };
});

describe("VerListaFavoritosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Se pasan las props correctas a ListaPaginada", () => {
    render(
      <MemoryRouter>
        <VerListaFavoritosPage />
      </MemoryRouter>
    );

    expect(listaPaginadaProps.recuperarDatos).toBe(verFavoritos);
    expect(listaPaginadaProps.urlInicial).toBeNull();
    expect(typeof listaPaginadaProps.renderItem).toBe("function");
  });

  it("Se muestra el título y el botón de volver atrás", () => {
    render(
      <MemoryRouter>
        <VerListaFavoritosPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /tu lista de asignaturas favoritas/i })).toBeInTheDocument();

    const atras = screen.getByRole("button", { name: /← volver atrás/i });
    expect(atras).toBeInTheDocument();
    fireEvent.click(atras);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("Se renderiza la lista usando renderItem", () => {
    render(
      <MemoryRouter>
        <VerListaFavoritosPage />
      </MemoryRouter>
    );

    const lista = screen.getByTestId("lista");
    expect(lista).toBeInTheDocument();

    const link1 = screen.getByText("Asignatura de ejemplo 1");
    expect(link1).toHaveAttribute("href", "/asignaturas/12");

    const link2 = screen.getByText("Asignatura de ejemplo 2");
    expect(link2).toHaveAttribute("href", "/asignaturas/19");
  });
});
