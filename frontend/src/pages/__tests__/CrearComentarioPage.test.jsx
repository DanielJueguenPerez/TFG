import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CrearComentarioPage from "../CrearComentarioPage";
import toast from "react-hot-toast";

const crearComentarioMock = vi.fn();
const navigateMock = vi.fn();

// Mock del servicio
vi.mock("../../api/comentarios", () => ({
  __esModule: true,
  crearComentario: (...args) => crearComentarioMock(...args),
}));

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
    useParams: () => ({ id: 1 }),
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

vi.mock("../../components/ComentarioInput", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ onSubmit, onCancel }) =>
      React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          {
            "data-testid": "submit-btn",
            onClick: () => onSubmit("Texto de prueba"),
          },
          "Publicar"
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

describe("CrearComentarioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Publicar comentario con éxito, muestra el toast y navega", async () => {
    crearComentarioMock.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <CrearComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(crearComentarioMock).toHaveBeenCalledWith(1, "Texto de prueba");
    });

    expect(toast.success).toHaveBeenCalledWith("Comentario creado con éxito");

    expect(navigateMock).toHaveBeenCalledWith(-1);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Comentario creado con éxito"
    );
  });

  it("Publicar comentario falla, muestra el toast y no navega", async () => {
    crearComentarioMock.mockRejectedValueOnce(new Error("fail"));

    render(
      <MemoryRouter>
        <CrearComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("submit-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(crearComentarioMock).toHaveBeenCalledWith(1, "Texto de prueba");
    });

    expect(toast.error).toHaveBeenCalledWith("Error al crear el comentario");

    expect(navigateMock).not.toHaveBeenCalled();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Error al crear el comentario"
    );
  });

  it("Botón de cancelar navega atrás y no llama al servicio", async () => {
    render(
      <MemoryRouter>
        <CrearComentarioPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByTestId("cancel-btn"));
    fireEvent.click(screen.getByTestId("cancel-btn"));

    expect(crearComentarioMock).not.toHaveBeenCalled();

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
