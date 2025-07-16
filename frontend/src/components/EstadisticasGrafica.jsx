import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useRef } from "react";

const colores = {
  aprobados: "#C084FC",
  suspensos: "#EC4899",
  no_presentados: "#7C3AED",
};

export default function EstadisticasGrafica({ año, datos, titulo }) {
  const graficaDatos = [
    { name: "Aprobados", value: datos.aprobados },
    { name: "Suspensos", value: datos.suspensos },
    { name: "No Presentados", value: datos.no_presentados },
  ];
  const liveRef = useRef(null);

  const cabecera = titulo ? titulo : año != null ? `Año ${año}` : "-";

  const total = datos.num_matriculados;

  const textoNarracion = `Gráfica ${cabecera}: ${datos.aprobados} aprobados, ${datos.suspensos} suspensos, ${datos.no_presentados} no presentados; total ${total} matriculados.`;

  const handleFocus = () => {
    if (liveRef.current) {
      liveRef.current.textContent = textoNarracion;
    }
  };

  return (
    <div className="border rounded p-4 mb-6 shadow flex flex-col items-center w-full max-w-sm">
      <h1 className=" text-lg font-semibold mb-2">{cabecera}</h1>

      <div ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        tabIndex={0}
        role="region"
        aria-label={textoNarracion}
        onFocus={handleFocus}
        className="w-full focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
      >
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={graficaDatos}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={({ value, x, y }) => (
                <text
                  x={x}
                  y={y}
                  fill="#000"
                  fontSize={12}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {value}
                </text>
              )}
            >
              {graficaDatos.map((_, index) => (
                <Cell key={index} fill={Object.values(colores)[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4 mb-4">
        {graficaDatos.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full block"
              style={{ backgroundColor: Object.values(colores)[index] }}
            />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-600">
        Total matriculados: {total}
      </p>
    </div>
  );
}
