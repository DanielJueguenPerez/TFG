import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerDetallesGradoPage from "../VerDetallesGradoPage";
import { verDetallesGrado } from "../../api/grados";

const navigateMock = vi.fn();
const mockGrado = {
  nombre: "Grado de Prueba",
  url: "http://udc.es/grado-prueba",
  asignaturas_cursos: [
    {
      curso: 1,
      asignaturas: [
        { id_asignatura: 1, nombre: "Asignatura 1" },
        { id_asignatura: 2, nombre: "Asignatura 2" },
      ],
    },
    { curso: 2, asignaturas: [{ id_asignatura: 3, nombre: "Asignatura 3" }] },
  ],
};

// Mock del servicio
vi.mock("../../api/grados", () => ({
  __esModule: true,
  verDetallesGrado: vi.fn(),
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

describe("VerDetallesGradoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Muestra titulo, enlace y cursos colapsados", async () => {
    verDetallesGrado.mockResolvedValue(mockGrado);

    render(
      <MemoryRouter>
        <VerDetallesGradoPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: mockGrado.nombre })
      ).toBeInTheDocument();
    });

    const link = screen.getByRole("link", { name: /Ver en la web oficial/ });
    expect(link).toHaveAttribute("href", mockGrado.url);
    expect(link).toHaveAttribute("target", "_blank");

    const atras = screen.getByRole("button", { name: /← volver atrás/i });
    expect(atras).toBeInTheDocument();
    fireEvent.click(atras);
    expect(navigateMock).toHaveBeenCalledWith(-1);

    expect(screen.queryByText("Asignatura 1")).toBeNull();
    expect(screen.queryByText("Asignatura 3")).toBeNull();
  });

  it("Al pulsar el curso muestra y oculta las asignaturas", async () => {
    verDetallesGrado.mockResolvedValue(mockGrado);

    render(
      <MemoryRouter>
        <VerDetallesGradoPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Curso 1/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Curso 2/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Curso 1/i })
    );
    expect(screen.getByText("Asignatura 1")).toBeInTheDocument();
    expect(screen.getByText("Asignatura 2")).toBeInTheDocument();  

    const link1 = screen.getByRole("link", { name: "Asignatura 1" });
    expect(link1).toHaveAttribute("href", "/asignaturas/1");

    fireEvent.click(
      screen.getByRole("button", { name: /Curso 1/i })
    );
    expect(screen.queryByText("Asignatura 1")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: /Curso 2/i })
    );
    expect(screen.getByText("Asignatura 3")).toBeInTheDocument();

    const link2 = screen.getByRole("link", { name: "Asignatura 3" });
    expect(link2).toHaveAttribute("href", "/asignaturas/3");
  });
});
