import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../LoginPage";
import toast from 'react-hot-toast';

const loginUsuarioMock = vi.fn();
const loginMock = vi.fn();
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/auth", () => {
  return {
    __esModule: true,
    loginUsuario: (...args) => loginUsuarioMock(...args),
  };
});

// Mock del contexto
vi.mock("../../context/UserContext", () => {
  return {
    __esModule: true,
    useUser: () => ({ login: loginMock }),
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
    useLocation: () => ({ pathname: "/login" }),
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
    default: ({ onSubmit }) =>
      React.createElement(
        "button",
        {
          type: "button",
          "data-testid": "submit-btn",
          onClick: () =>
            onSubmit({
              username: "pepito",
              password: "12345678",
            }),
        },
        "Iniciar Sesión"
      ),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Login con exito llama a login, muestra el toast y navega", async () => {
    loginUsuarioMock.mockResolvedValue({
      token: 'tokenValido123',
      user: { id: 1, nombre: 'Pepe' },
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
        expect(loginUsuarioMock).toHaveBeenCalled();

        expect(loginMock).toHaveBeenCalledWith('tokenValido123', { id: 1, nombre: 'Pepe' });
    })

    expect(toast.success).toHaveBeenCalledWith('Sesión iniciada');

    expect(navigateMock).toHaveBeenCalledWith('/');

    expect(screen.getByRole('alert')).toHaveTextContent('Sesión iniciada correctamente');
  });

    it("Error de login, muestra el toast de error y no navega", async () => {
    loginUsuarioMock.mockRejectedValue({
      response:{
        data: { username: ['no existe'], password: 'incorrecto'},
      },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('submit-btn'));

    const expectedMsg = 'username: no existe\npassword: incorrecto';

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(`No se pudo iniciar sesión:\n\n${expectedMsg}`);
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/Error: username: no existe\s+password: incorrecto/);
    
    expect(navigateMock).not.toHaveBeenCalled();
  })
})