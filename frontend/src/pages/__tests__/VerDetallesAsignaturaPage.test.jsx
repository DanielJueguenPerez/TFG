import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerDetallesAsignaturaPage from "../VerDetallesAsignaturaPage";
import { verDetallesAsignatura } from "../../api/asignaturas";

var estadisticasGraficaProps = [];
const navigateMock = vi.fn();
const toggleFavoritoMock = vi.fn();
const mockEstadisticas = {
  media_estadisticas: {
    aprobados: 75,
    suspensos: 25,
    no_presentados: 10,
    num_matriculados: 110,
  },
  estadisticas_anios: [
    {
      "Año Academico": "2023/2024",
      estadisticas: [
        {
          aprobados: 80,
          suspensos: 20,
          no_presentados: 5,
          num_matriculados: 105,
        },
      ],
    },
  ],
};

const mockAsignatura = {
  id_asignatura: 1,
  nombre: "Asignatura de Prueba",
  nombre_grado: "Grado de Prueba",
  ...mockEstadisticas,
};

// Mock del servicio
vi.mock("../../api/asignaturas", () => ({
  __esModule: true,
  verDetallesAsignatura: vi.fn(),
}));

// Mock del contexto de favoritos
vi.mock("../../context/FavoritosContext", () => ({
  __esModule: true,
  useFavoritos: () => ({
    toggleFavorito: toggleFavoritoMock,
    esFavorita: (id) => id === mockAsignatura.id_asignatura,
  }),
}));

// Mock del contexto de usuario
vi.mock("../../context/UserContext", () => ({
  __esModule: true,
  useUser: () => ({ estaLogueado: true }),
}));

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: 1 }),
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

vi.mock("../../components/EstadisticasGrafica", () => {
  const React = require("react");
  estadisticasGraficaProps = [];
  return {
    __esModule: true,
    default: (props) => {
      estadisticasGraficaProps.push(props);
      return React.createElement(
        "div",
        { "data-testid": "grafica" },
        props.titulo
      );
    },
  };
});

describe("VerDetallesAsignaturaPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    estadisticasGraficaProps = [];
  });

  it("Carga y muestra correctamente datos y botones", async () => {
    verDetallesAsignatura.mockResolvedValue(mockAsignatura);
    render(
      <MemoryRouter>
        <VerDetallesAsignaturaPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: mockAsignatura.nombre })
      ).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /← Volver atrás/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);

    fireEvent.click(screen.getByRole("button", { name: /Ver comentarios/i }));
    expect(navigateMock).toHaveBeenCalledWith(
      `/comentarios/${mockAsignatura.id_asignatura}`
    );
  });

  it("ToggleFavorito funciona correctamente", async () => {
    verDetallesAsignatura.mockResolvedValue(mockAsignatura);
    render(
      <MemoryRouter>
        <VerDetallesAsignaturaPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("heading", {  name: mockAsignatura.nombre })).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByRole("button", { name: "" })
    );
    expect(toggleFavoritoMock).toHaveBeenCalledWith(mockAsignatura.id_asignatura);
  });

  it("Pasa correctamente datos de estadistica de media y año", async () => {
    verDetallesAsignatura.mockResolvedValue(mockAsignatura);

    render(
      <MemoryRouter>
        <VerDetallesAsignaturaPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getAllByTestId("grafica"));

    expect(estadisticasGraficaProps).toHaveLength(2);

    expect(estadisticasGraficaProps[0]).toMatchObject({
      titulo: "Media de todos los años",
      datos: {
        aprobados: 75,
        suspensos: 25,
        no_presentados: 10,
        num_matriculados: 110,
      },
    });

    expect(estadisticasGraficaProps[1]).toMatchObject({
      año: "2023/2024",
      datos: {
        aprobados: 80,
        suspensos: 20,
        no_presentados: 5,
        num_matriculados: 105,
      },
    });
  });
});
