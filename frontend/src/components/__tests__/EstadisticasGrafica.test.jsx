import { render, screen, fireEvent } from "@testing-library/react";
import EstadisticasGrafica from "../EstadisticasGrafica";

const datos = {
  aprobados: 100,
  suspensos: 50,
  no_presentados: 25,
  num_matriculados: 175,
};

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

describe("EstadisticasGrafica", () => {
  it("Muestra correctamente los datos y accesibilidad", () => {
    render(<EstadisticasGrafica año={2023} datos={datos} />);

    expect(
      screen.getByRole("heading", { name: /año 2023/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText((t) => t.toLowerCase().includes("aprobados"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((t) => t.toLowerCase().includes("suspensos"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((t) => t.toLowerCase().includes("no presentados"))
    ).toBeInTheDocument();

    expect(screen.getByText(/Total matriculados: 175/)).toBeInTheDocument();
  });

  it("Actualiza aria-live con el texto narrativo al enfocar", () => {
    render(<EstadisticasGrafica titulo="Prueba" datos={datos} />);

    const region = screen.getByRole("region", {name: /Gráfica Prueba/i });
    fireEvent.focus(region);

    const liveRegion = screen.getByText("Gráfica Prueba: 100 aprobados, 50 suspensos, 25 no presentados; total 175 matriculados.");
    expect(liveRegion).toBeInTheDocument();
  });
});
