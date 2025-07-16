import { render, screen } from "@testing-library/react";
import TransicionAnimada from "../TransicionAnimada";
import { vi } from "vitest";

vi.useFakeTimers();

describe("TransicionAnimada", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

    afterEach(() => {
    vi.useRealTimers();
  });

  it("Renderiza el contenido con animación", () => {
    render(
      <TransicionAnimada animationKey="uno">
        <div>Contenido animado</div>
      </TransicionAnimada>
    );
    expect(screen.getByText("Contenido animado")).toBeInTheDocument();
  });
});
