import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerComentariosPropiosPage from "../VerComentariosPropiosPage";
import { verComentariosPropios } from "../../api/auth";

let listaPaginadaProps = {};
const navigateMock = vi.fn();
const comentarios = [
  {
    id_comentario: 1,
    id_asignatura: 4,
    nombre_asignatura: "Asignatura de ejemplo 1",
    id_grado: 1,
    nombre_grado: "Grado de ejemplo 1",
    texto: "Comentario de ejemplo 1",
    fecha: "2025-07-22T12:00:00Z",
  },
  {
    id_comentario: 2,
    id_asignatura: 23,
    nombre_asignatura: "Asignatura de ejemplo 2",
    id_grado: 1,
    nombre_grado: "Grado de ejemplo 1",
    texto: "Comentario de ejemplo 2",
    fecha: "2025-07-22T12:30:00Z",
  },
];

// Mock del servicio
vi.mock("../../api/auth", () => ({
  __esModule: true,
  verComentariosPropios: vi.fn(),
}));

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: "/usuario/comentarios" }),
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
      return React.createElement(
        "ul",
        { "data-testid": "lista" },
        ...comentarios.map((item) => props.renderItem(item))
      );
    },
  };
});

describe("VerComentariosPropiosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Se pasan las props correctas a ListaPaginada", () => {
    render(
      <MemoryRouter>
        <VerComentariosPropiosPage />
      </MemoryRouter>
    );

    expect(typeof listaPaginadaProps.recuperarDatos).toBe("function");
    expect(listaPaginadaProps.urlInicial).toBeNull();
    expect(typeof listaPaginadaProps.renderItem).toBe("function");
  });

  it("Se muestra el nombre de la asignatura y el titulo, y boton atrás navega a -1", () => {
    render(
      <MemoryRouter>
        <VerComentariosPropiosPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Tus comentarios/i })
    ).toBeInTheDocument();

    const atras = screen.getByRole("button", { name: /← volver atrás/i });
    expect(atras).toBeInTheDocument();
    fireEvent.click(atras);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("Se renderiza la lista usando renderItem", () => {
    render(
      <MemoryRouter>
        <VerComentariosPropiosPage />
      </MemoryRouter>
    );

    const lista = screen.getByTestId("lista");
    expect(lista).toBeInTheDocument();

    const comentario1 = screen.getByText("Comentario de ejemplo 1");
    expect(comentario1).toBeInTheDocument();
    const [linkEditar] = screen.getAllByRole("link", { name: /Editar/i });
    expect(linkEditar).toHaveAttribute(
      "href",
      `/comentarios/editar/${comentarios[0].id_comentario}`
    );

    const asignaturaLink = screen.getByRole("link", {
      name: comentarios[0].nombre_asignatura,
    });
    expect(asignaturaLink).toHaveAttribute(
      "href",
      `/asignaturas/${comentarios[0].id_asignatura}`
    );

    const [gradoLink] = screen.getAllByRole("link", {
      name: comentarios[0].nombre_grado,
    });
    expect(gradoLink).toHaveAttribute(
      "href",
      `/grados/${comentarios[0].id_grado}`
    );

    const comentario2 = screen.getByText("Comentario de ejemplo 2");
    expect(comentario2).toBeInTheDocument();

    const linksEditar = screen.queryAllByRole("link", { name: /Editar/i });
    expect(linksEditar).toHaveLength(2);
  });
});
