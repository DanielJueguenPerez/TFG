import { render, screen, fireEvent } from "@testing-library/react";
import FormularioInput from "../FormularioInput";

const campos = [
  { nombre: "email", tipo: "text", etiqueta: "Correo", requerido: true },
  {
    nombre: "password",
    tipo: "password",
    etiqueta: "Contraseña",
    requerido: true,
  },
  {
    nombre: "password2",
    tipo: "password",
    etiqueta: "Repetir contraseña",
    requerido: true,
  },
];

const valoresCorrectos = {
  email: "pepito@pepito.es",
  password: "12341234",
  password2: "12341234",
};

describe("FormularioInput", () => {
  it("Se renderizan los campos", () => {
    render(
      <FormularioInput
        campos={campos}
        textoBoton="Enviar"
        onSubmit={() => {}}
      />
    );
    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Repetir contraseña")).toBeInTheDocument();
  });

  it("Mostrar errores si campos requeridos están vacíos", () => {
    render(
      <FormularioInput
        campos={campos}
        textoBoton="Enviar"
        onSubmit={() => {}}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(screen.getAllByText("Este campo es obligatorio")).toHaveLength(3);
  });

  it("Error si el email es inválido", () => {
    render(
      <FormularioInput
        campos={campos}
        textoBoton="Enviar"
        onSubmit={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "correo-invalido", name: "email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(
      screen.getByText("Correo electrónico no válido")
    ).toBeInTheDocument();
  });

  it("Error si contraseñas no coinciden", () => {
    render(
      <FormularioInput
        campos={campos}
        textoBoton="Enviar"
        onSubmit={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "correo-invalido", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "1234", name: "password" },
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
      target: { value: "12345", name: "password2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(
      screen.getByText("Las contraseñas no coinciden")
    ).toBeInTheDocument();
  });

  it("Enviar valores válidos", () => {
    const handleSubmit = vi.fn();
    render(
      <FormularioInput
        campos={campos}
        textoBoton="Enviar"
        onSubmit={handleSubmit}
      />
    );
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: valoresCorrectos.email, name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: valoresCorrectos.password, name: "password" },
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
      target: { value: valoresCorrectos.password2, name: "password2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(valoresCorrectos);
  });

  it("Pulsar botón de cancelar", () => {
    const handleCancel = vi.fn();
    render(
      <FormularioInput
        campos={campos}
        textoBoton="Enviar"
        onSubmit={() => {}}
        onCancel={handleCancel}
      />
    );
    
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(handleCancel).toHaveBeenCalled();
  });
});
