import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerComentariosPage from "../VerComentariosPage";
import { verDetallesAsignatura } from "../../api/asignaturas";

let listaPaginadaProps = {};
const navigateMock = vi.fn();
const asignatura = { id_asignatura: 4, nombre: "Asignatura de ejemplo 1" };
const userMock = { username: "user1" };
const comentarios = [
  {
    id_comentario: 1,
    id_asignatura: 4,
    texto: "Comentario de ejemplo 1",
    username: "user1",
    fecha: "2025-07-22T12:00:00Z",
  },
  {
    id_comentario: 2,
    id_asignatura: 4,
    texto: "Comentario de ejemplo 2",
    username: "user-random",
    fecha: "2025-07-22T12:30:00Z",
  },
];

// Mock del servicio de comentarios
vi.mock("../../api/comentarios", () => ({
  __esModule: true,
  verComentarios: vi.fn(),
}));

// Mock del servicio de asignaturas
vi.mock("../../api/asignaturas", () => ({
  __esModule: true,
  verDetallesAsignatura: vi.fn(),
}));

// Mock del contexto de usuario
vi.mock("../../context/UserContext", () => ({
  __esModule: true,
  useUser: () => ({ user: userMock, estaLogueado: true }),
}));

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: 4 }),
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

describe("VerComentariosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Se pasan las props correctas a ListaPaginada", () => {
    render(
      <MemoryRouter>
        <VerComentariosPage />
      </MemoryRouter>
    );

    expect(typeof listaPaginadaProps.recuperarDatos).toBe("function");
    expect(listaPaginadaProps.urlInicial).toBeNull();
    expect(typeof listaPaginadaProps.renderItem).toBe("function");
  });

  it("Se muestra el nombre de la asignatura y el titulo, y boton atrás navega a -1", async () => {
    verDetallesAsignatura.mockResolvedValue(asignatura);

    render(
      <MemoryRouter>
        <VerComentariosPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Comentarios de/i })
      ).toHaveTextContent(`Comentarios de ${asignatura.nombre}`);
    });

    const atras = screen.getByRole("button", { name: /← volver atrás/i });
    expect(atras).toBeInTheDocument();
    fireEvent.click(atras);
    expect(navigateMock).toHaveBeenCalledWith(-1);

    const publicarComentario = screen.getByRole("button", {
      name: /Publicar Comentario/i,
    });
    fireEvent.click(publicarComentario);

    expect(navigateMock).toHaveBeenCalledWith(`/comentarios/nuevo/${asignatura.id_asignatura}`);

  });

  it("Se renderiza la lista usando renderItem", () => {
    render(
      <MemoryRouter>
        <VerComentariosPage />
      </MemoryRouter>
    );

    const lista = screen.getByTestId("lista");
    expect(lista).toBeInTheDocument();

    const comentario1 = screen.getByText("Comentario de ejemplo 1");
    expect(comentario1).toBeInTheDocument();
    const linkEditar = screen.getByRole("link", { name: /Editar/i });
    expect(linkEditar).toHaveAttribute(
      "href",
      `/comentarios/editar/${comentarios[0].id_comentario}`
    );

    const comentario2 = screen.getByText("Comentario de ejemplo 2");
    expect(comentario2).toBeInTheDocument();
    const linksEditar = screen.queryAllByRole("link", { name: /Editar/i });

    expect(linksEditar).toHaveLength(1);
  });
});
