import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CambiarPasswordPage from "../CambiarPasswordPage";
import toast from "react-hot-toast";
import { cambiarPassword } from "../../api/auth";

const cambiarPasswordMock = vi.fn();
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/auth", () => {
  return {
    __esModule: true,
    cambiarPassword: (...args) => cambiarPasswordMock(...args),
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
    useLocation: () => ({ pathname: "/usuario/cambiar-password" }),
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
    default: ({ onSubmit, onCancel }) =>
      React.createElement(
        "div",
        null,
        // Botón Guardar
        React.createElement(
          "button",
          {
            type: "button",
            "data-testid": "submit-btn",
            onClick: () =>
              onSubmit({
                password_actual: "12345678",
                password_nuevo: "123456789",
                password_nuevo_2: "123456789",
              }),
          },
          "Guardar"
        ),
        // Botón Cancelar
        React.createElement(
          "button",
          {
            type: "button",
            "data-testid": "cancel-btn",
            onClick: () => onCancel(),
          },
          "Cancelar"
        )
      ),
  };
});

describe("CambiarPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Cambio de contraseña con éxito, muestra el toast y navega", async () => {
    cambiarPasswordMock.mockResolvedValue({});

    render(
      <MemoryRouter>
        <CambiarPasswordPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(cambiarPasswordMock).toHaveBeenCalledWith({
        password_actual: "12345678",
        password_nuevo: "123456789",
        password_nuevo_2: "123456789",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Contraseña cambiada con éxito");

    expect(navigateMock).toHaveBeenCalledWith("/usuario/ver-perfil");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Contraseña cambiada con éxito"
    );
  });



  it("Cancelar, y redirige a ver perfil", async () => {
    render(
      <MemoryRouter>
        <CambiarPasswordPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("cancel-btn"));
    fireEvent.click(screen.getByTestId("cancel-btn"));

    expect(navigateMock).toHaveBeenCalledWith("/usuario/ver-perfil");
  });

  it("Error al cambiar contraseña, muestra el toast de error y no navega", async () => {

    cambiarPasswordMock.mockRejectedValue({
      response: {
        data: {
        password_actual: ["incorrecto"],
        password_nuevo: "corto",
        },
      },
    });

    render(
      <MemoryRouter>
        <CambiarPasswordPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    const expectedMsg = "password_actual: incorrecto\npassword_nuevo: corto";

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `No se pudo cambiar la contraseña:\n\n${expectedMsg}`
      );
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      /Error: password_actual: incorrecto\s+password_nuevo: corto/
    );

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
