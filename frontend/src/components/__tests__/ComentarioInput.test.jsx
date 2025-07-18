import { render, screen, fireEvent } from "@testing-library/react";
import ComentarioInput from "../ComentarioInput";

describe("ComentarioInput", () => {
  it("Se renderiza correctamente el text area y botones", () => {
    render(<ComentarioInput onSubmit={() => {}} onCancel={() => {}} />);
    expect(
      screen.getAllByPlaceholderText("Escribe tu comentario...")[0]
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publicar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
  });

  it("Se muestra el texto inicial (si lo hubiese)", () => {
    render(
      <ComentarioInput textoInicial="Texto de prueba" onSubmit={() => {}} />
    );
    expect(screen.getByDisplayValue("Texto de prueba")).toBeInTheDocument();
  });

  it("Se actualiza el textArea al escribir", () => {
    render(<ComentarioInput onSubmit={() => {}} />);
    const textarea = screen.getAllByPlaceholderText(
      "Escribe tu comentario..."
    )[0];
    fireEvent.change(textarea, { target: { value: "Nuevo Texto" } });
    expect(textarea.value).toBe("Nuevo Texto");
  });

  it("Muestra error si el textArea está vacío", () => {
    render(<ComentarioInput onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));
    expect(
      screen.getByText("El comentario no puede estar vacío")
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("Llama a onSubmit con texto trimmeado si es válido", () => {
    const handleSubmit = vi.fn();
    render(<ComentarioInput onSubmit={handleSubmit} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {target: {value: "     comentario válido      "}});
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));
    expect(handleSubmit).toHaveBeenCalledWith("comentario válido");
  });

  it("Llama a onCancel al pulsar el botón Cancelar", () => {
    const handleCancel = vi.fn();
    render(<ComentarioInput onSubmit={() => {}} onCancel={handleCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(handleCancel).toHaveBeenCalled();
  });

    it("Muestra el botón de borrar y lo ejecuta al pulsar si se le pasa onDelete", () => {
    const handleDelete = vi.fn();
    render(<ComentarioInput onSubmit={() => {}} onDelete={handleDelete} />);
    const deleteBoton = screen.getByRole("button", { name: /borrar/i });
    expect(deleteBoton).toBeInTheDocument();
    fireEvent.click(deleteBoton);
    expect(handleDelete).toHaveBeenCalled();
  });
});
