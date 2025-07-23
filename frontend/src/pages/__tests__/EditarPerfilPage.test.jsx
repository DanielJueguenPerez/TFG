import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import EditarPerfilPage from "../EditarPerfilPage";
import toast from "react-hot-toast";

const verPerfilMock = vi.fn();
const editarPerfilMock = vi.fn();
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/auth", () => {
  return {
    __esModule: true,
    verPerfilUsuario: (...args) => verPerfilMock(...args),
    editarPerfilUsuario: (...args) => editarPerfilMock(...args),
  };
});

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
    useLocation: () => ({ pathname: "/usuario/editar-perfil" }),
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

//Mock de FormularioInput
vi.mock("../../components/FormularioInput", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ valoresIniciales, onSubmit, onCancel }) =>
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { "data-testid": "valores-iniciales" },
          JSON.stringify(valoresIniciales)
        ),
        React.createElement(
          "button",
          {
            "data-testid": "submit-btn",
            onClick: () =>
              onSubmit({ ...valoresIniciales, nombre: "NombreRandom" }),
          },
          "Guardar"
        ),
        React.createElement(
          "button",
          {
            "data-testid": "cancel-btn",
            onClick: () => onCancel(),
          },
          "Cancelar"
        )
      ),
  };
});

describe("EditarPerfilPage", () => {
  const datosPerfil = {
    username: "Pepito",
    email: "pepito@pepito.es",
    nombre: "Pepe",
    apellidos: "Pérez",
    DNI: "12345678A",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Muestra 'Cargando perfil...' mientras se carga el perfil ", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <EditarPerfilPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando perfil\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Cargando perfil\.\.\./i)).toBeNull();
    });
  });

  it("Renderiza el formulario con valores iniciales", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <EditarPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const iniciales = screen.getByTestId("valores-iniciales");
      expect(iniciales).toHaveTextContent(JSON.stringify(datosPerfil));
    });
  });

  it("Editar perfil con éxito, muestra el toast y navega", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);
    editarPerfilMock.mockResolvedValue({});

    render(
      <MemoryRouter>
        <EditarPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(editarPerfilMock).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: "NombreRandom" })
      );
    });
    expect(toast.success).toHaveBeenCalledWith("Datos editados con éxito");

    expect(navigateMock).toHaveBeenCalledWith("/usuario/ver-perfil");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Datos editados con éxito"
    );
  });

  it("Renderiza el formulario con valores iniciales", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <EditarPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const iniciales = screen.getByTestId("valores-iniciales");
      expect(iniciales).toHaveTextContent(JSON.stringify(datosPerfil));
    });
  });

  it("Cancelar, y redirife a ver perfil", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <EditarPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("cancel-btn"));
    fireEvent.click(screen.getByTestId("cancel-btn"));

    expect(navigateMock).toHaveBeenCalledWith("/usuario/ver-perfil");
  });

  it("Error al editar perfil, muestra el toast de error y no navega", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    editarPerfilMock.mockRejectedValue({
        response: {
            data: {
                email: ["inválido"],
            },
        },
    });

    render(
      <MemoryRouter>
        <EditarPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    const expectedMsg = "email: inválido";

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `No se pudo editar los datos:\n\n${expectedMsg}`
      );
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      /Error: email: inválido/
    );

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
