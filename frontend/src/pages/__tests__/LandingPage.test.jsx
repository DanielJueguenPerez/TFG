import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { describe, it, beforeEach, afterEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../LandingPage";

// Mocks de las imagenes de fondo y el logo de la udc
vi.mock("../../assets/udc.png", () => ({ default: "udc-logo" }));
vi.mock("../../assets/landing.jpg", () => ({ default: "landing-bg" }));

// Mock de la TransicionAnimada 
vi.mock("../../components/TransicionAnimada", () => {
  const React = require("react");
  return {
    __esModule: true, // Cuando se pone "export default function" hay que indicar que es __esModule 
    default: ({ children }) =>
      React.createElement("div", { "data-testid": "transicion" }, children),
  };
});

// Mock del framer motion 
vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    motion: {
      p: ({ children, ...props }) => React.createElement("p", props, children),
    },
    AnimatePresence: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// Mock de react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/landing" }), // Indicamos que estamos en "/landing"
  };
});

describe("LandingPage", () => {
  const frases = [
    "La plataforma para ayudarte a decidir tu itinerario en la universidad.",
    "Descubre todos los grados de la UDC.",
    "Comprueba las estisticas de cada asignatura.",
    "Diseña tu itinerario académico ideal.",
    "Intercambia consejos y opiniones con otros alumnos.",
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renderiza título y logo correctamente", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Bienvenid@ a MatricUDC/i })
    ).toBeInTheDocument();

    const logo = screen.getByAltText("Logo de la UDC");
    expect(logo).toHaveAttribute("src", "udc-logo");
  });

  it("muestra la primera frase y luego cicla cada 4 segundos", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(frases[0])).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(frases[1])).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(frases[2])).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(frases[3])).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(frases[4])).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(frases[0])).toBeInTheDocument();
  });
});
