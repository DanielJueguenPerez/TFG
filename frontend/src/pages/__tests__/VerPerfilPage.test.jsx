import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerPerfilPage from "../VerPerfilPage";

const verPerfilMock = vi.fn();

// Mock del servicio
vi.mock("../../api/auth", () => {
  return {
    __esModule: true,
    verPerfilUsuario: (...args) => verPerfilMock(...args),
  };
});

// Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/usuario/ver-perfil" }),
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

describe("VerPerfilPage", () => {
  const datosPerfil = {
    username: "pepito",
    email: "pepito@pepito.com",
    nombre: "Pepe",
    apellidos: "Pérez",
    DNI: "12345678A",
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Muestra 'Cargando perfil...' mientras se carga el perfil ", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <VerPerfilPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando perfil\.\.\./i)).toBeInTheDocument();
  });

  it("Renderiza los datos de perfil correctamente", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <VerPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(datosPerfil.username)).toBeInTheDocument();
      expect(screen.getByText(datosPerfil.email)).toBeInTheDocument();
      expect(screen.getByText(datosPerfil.nombre)).toBeInTheDocument();
      expect(screen.getByText(datosPerfil.apellidos)).toBeInTheDocument();
      expect(screen.getByText(datosPerfil.DNI)).toBeInTheDocument();
    });
  });

  it("Muestra los enlaces para editar perfil y cambiar contraseña", async () => {
    verPerfilMock.mockResolvedValue(datosPerfil);

    render(
      <MemoryRouter>
        <VerPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      screen.getByText(datosPerfil.username);
    });

    const editarPerfil = screen.getByRole("link", {
      name: /Editar datos de perfil/i,
    });
    expect(editarPerfil).toHaveAttribute("href", "/usuario/editar-perfil");

    const editarPassword = screen.getByRole("link", {
      name: /Cambiar contraseña/i,
    });
    expect(editarPassword).toHaveAttribute("href", "/usuario/cambiar-password");
  });

  it("Error al ver perfil", async () => {
    verPerfilMock.mockRejectedValue(new Error("fail"));

    render(
      <MemoryRouter>
        <VerPerfilPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No se ha podido recuperar los datos de perfil/i)
      ).toBeInTheDocument();
    });
  });
});
