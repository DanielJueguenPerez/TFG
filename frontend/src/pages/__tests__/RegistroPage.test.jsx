import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RegistroPage from "../RegistroPage";
import toast from 'react-hot-toast';

const registroUsuarioMock = vi.fn();
const loginMock = vi.fn();
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/auth", () => {
  return {
    __esModule: true,
    registroUsuario: (...args) => registroUsuarioMock(...args),
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
    useLocation: () => ({ pathname: "/registro" }),
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
              password2: "12345678",
              email: "pepito@pepito.es",
              nombre: "Pepe",
              apellidos: "Perez",
              DNI: "12345678A",
            }),
        },
        "Registrarse"
      ),
  };
});

describe("RegistroPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Registro con exito, se guarda el token, llama a login, muestra el toast y navega", async () => {
    registroUsuarioMock.mockResolvedValue({
      token: 'tokenValido123',
      user: { id: 1, name: 'Pepe' },
    })

    render(
      <MemoryRouter>
        <RegistroPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId('submit-btn'))

    await waitFor(() => {
        expect(registroUsuarioMock).toHaveBeenCalled()

        expect(localStorage.getItem('token')).toBe('tokenValido123')

        expect(loginMock).toHaveBeenCalledWith('tokenValido123', { id: 1, name: 'Pepe' })
    })

    expect(toast.success).toHaveBeenCalledWith('Usuario registrado con éxito')

    expect(navigateMock).toHaveBeenCalledWith('/')

    expect(screen.getByRole('alert')).toHaveTextContent('Usuario registrado con éxito')
  })

    it("Error en registro, muestra el toast de error y no navega", async () => {
    registroUsuarioMock.mockRejectedValue({
      response:{
        data: { username: ['existente'], email: 'repetido'},
      },
    })

    render(
      <MemoryRouter>
        <RegistroPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('submit-btn'))

    const expectedMsg = 'username: existente\nemail: repetido';

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(`No se pudo completar el registro:\n\n${expectedMsg}`)
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/Error: username: existente\s+email: repetido/)
    
    expect(navigateMock).not.toHaveBeenCalled()
  })
})