import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const colores = {
  aprobados: "#4CAF50",
  suspensos: "#f87171",
  no_presentados: "#facc15",
};

export default function EstadisticasGrafica({ año, datos }) {
  const graficaDatos = [
    { name: "Aprobados", value: datos.aprobados },
    { name: "Suspensos", value: datos.suspensos },
    { name: "No Presentados", value: datos.no_presentados },
  ];

  const total = datos.num_matriculados;

  return (
    <div className="border rounded p-4 mb-6 shadow flex flex-col items-center w-full max-w-sm">
      <h3 className=" text-lg font-semibold mb-2">Año {año}</h3>

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
