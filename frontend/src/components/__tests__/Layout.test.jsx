import { render, screen } from "@testing-library/react";
import Layout from "../Layout";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../context/UserContext", () => ({
  useUser: vi.fn(() => ({ user: null, logout: vi.fn() }))
}));

describe("Layout", () => {

    it("Muestra siempre el header", () =>{
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Layout>
                    <div>Contenido</div>
                </Layout>
            </MemoryRouter>
        )
        expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("Muestra el fondo de las pantallas que no son landing page", () =>{
        render(
            <MemoryRouter initialEntries={["/otra-pagina"]}>
                <Layout>
                    <div>Contenido</div>
                </Layout>
            </MemoryRouter>
        )
        expect(screen.getByTestId("fondo-blanco")).toBeInTheDocument();
    });

    it("No muestra el fondo en la landing page", () =>{
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Layout>
                    <div>Contenido</div>
                </Layout>
            </MemoryRouter>
        )
        expect(screen.queryByTestId("fondo-blanco")).not.toBeInTheDocument();
    });

});