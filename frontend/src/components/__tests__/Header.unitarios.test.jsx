import { describe, it, expect, vi, beforeEach} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { useUser } from "../../context/UserContext";
import { useNavigate, useLocation, MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return{
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn(),
        LinkL: actual.Link,
    };
});

vi.mock("../../context/UserContext", () => ({
    useUser: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
    default: { success: vi.fn() },
    success: vi.fn(),
}));

describe("Header (unitario)", () => {
    const mockNavigate = vi.fn();
    const mockLogout = vi.fn();
    let mockPathname = "/";

    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue({ pathname: mockPathname});
    });

    it("Mostrar Hola, nombreusuario, si usuario logueado", () => {
        useUser.mockReturnValue({ user: {username: "Pepito"}, logout: mockLogout});
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText("Hola")). toBeInTheDocument();
        expect(screen.getByText("Pepito")).toHaveAttribute("href", "/usuario/ver-perfil");
    });

    it("Botones de login y registro si no hay usuario", () => {
        useUser.mockReturnValue({ user: null, logout: vi.fn() });
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
        expect(screen.getByText("Registrarse")).toBeInTheDocument();
    });

    it("Abrir y cerrar menú hamburguesa", () => {
        useUser.mockReturnValue({ user: {username: "Pepito"}, logout: mockLogout});
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const menuBoton = screen.getByLabelText("Toggle menu");
        fireEvent.click(menuBoton);
        const sidebar = screen.getByTestId("sidebar");
        expect(sidebar).toHaveClass("translate-x-0"); //menú abierto
        fireEvent.click(screen.getByLabelText("Cerrar menú"));
        expect(sidebar).toHaveClass("translate-x-full"); //menú cerrado
    });

    it("Cerrar sesión al pulsar el botón", () => {
        useUser.mockReturnValue({ user: {username: "Pepito"}, logout: mockLogout});
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const menuBoton = screen.getByLabelText("Toggle menu");
        fireEvent.click(menuBoton);
        const cerrarSesion = screen.getByText("Cerrar sesión");
        fireEvent.click(cerrarSesion);
        expect(mockLogout).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalled("¡Hasta pronto! 👋");
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("Cerrar el menú al clickar en el fondo", () => {
        useUser.mockReturnValue({ user: {username: "Pepito"}, logout: mockLogout});
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const menuBoton = screen.getByLabelText("Toggle menu");
        fireEvent.click(menuBoton);
        const fondoMenu = screen.getByTestId("fondoMenu");
        fireEvent.click(fondoMenu);
        const sidebar = screen.getByTestId("sidebar");
        expect(sidebar).toHaveClass("translate-x-full"); //menú cerrado
    });
    
    it("Cerrar el menú cuando se cambia de ruta", () => {
        useUser.mockReturnValue({ user: {username: "Pepito"}, logout: mockLogout});
        const {rerender} = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const menuBoton = screen.getByLabelText("Toggle menu");
        fireEvent.click(menuBoton);
        mockPathname = "/ruta-alternativa";
        useLocation.mockReturnValue({ pathname: mockPathname });
        rerender(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const sidebar = screen.getByTestId("sidebar");
        expect(sidebar).toHaveClass("translate-x-full"); //menú cerrado
    });

    it("Cerrar el menú al hacer click en los enlaces de login y registro", () => {
        useUser.mockReturnValue({ user: null });
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const menuBoton = screen.getByLabelText("Toggle menu");
        fireEvent.click(menuBoton);
        const login = screen.getAllByRole("link").find(link => link.getAttribute("href") === "/usuario/login");
        fireEvent.click(login);
        const registro = screen.getAllByRole("link").find(link => link.getAttribute("href") === "/usuario/registro");
        fireEvent.click(registro);
        const verGrados = screen.getByRole("link", { name: "🎓 Ver grados" });
        fireEvent.click(verGrados);
    });
});
