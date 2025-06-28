import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  // Array de frases que se van a monstrar en la Langing Page
  const frases = [
    "La plataforma para ayudarte a decidir tu itinerario en la universidad.",
    "Descubre todos los grados de la UDC.",
    "Comprueba las estisticas de cada asignatura.",
    "Intercambia consejos y opiniones con otros alumnos.",
    "Diseña tu itinerario académico ideal.",
  ];

  // Variable para llevar cuenta de que frase se debe mostrar
  const [indice, setIndice] = useState(0);

  // useEffect para establecer el intervalo de tiempo que duran las frases
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % frases.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="w-full h-full min-h-[calc(100vh-64px)] bg-gradient-to-b from-black via-indigo-900 to-white flex items-center justify-center">
      {/* Contenedor blanco donde se muestran las frases que se van sucediendo una despues de otra */}
      <div
        className="bg-white bg-opacity-70 px-6 py-8 rounded-xl w-full max-w-2xl min-h-40 h-40 
                flex flex-col justify-center items-center overflow-hidden transition-all duration-500"
      >
        <h1 className="text-2xl font-extrabold mb-8">Bienvenid@ a MatricUDC</h1>
        {/* Animador que da efecto de transicion y muestra las frases */}
        <div className="relative h-[80px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={indice}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute w-full px-4 text-center text-lg text-gray-800"
            >
              {frases[indice]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
