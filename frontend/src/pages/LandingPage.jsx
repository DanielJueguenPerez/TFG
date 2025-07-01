import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import udcLogo from "../assets/udc.png";
import landingBg from "../assets/landing.jpg";
import TransicionAnimada from "../components/TransicionAnimada";
import { useLocation } from "react-router-dom";

export default function LandingPage() {
  // Array de frases que se van a monstrar en la Langing Page
  const frases = [
    "La plataforma para ayudarte a decidir tu itinerario en la universidad.",
    "Descubre todos los grados de la UDC.",
    "Comprueba las estisticas de cada asignatura.",
    "Diseña tu itinerario académico ideal.",
    "Intercambia consejos y opiniones con otros alumnos.",
  ];

  // Variable para llevar cuenta de que frase se debe mostrar
  const [indice, setIndice] = useState(0);

  const location = useLocation();

  // useEffect para establecer el intervalo de tiempo que duran las frases
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % frases.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <TransicionAnimada animationKey={location.pathname}>
      <section
        style={{ backgroundImage: `url(${landingBg})` }}
        className="relative w-full min-h-screen overflow-y-auto bg-cover bg-center flex flex-col items-center justify-start pt-40"
      >
        {" "}
        <div className="flex flex-col items-center w-full max-w-4xl px-4">
          <h1
            className="font-heading text-white text-5xl md:text-6xl font-extrabold
          mb-28 text-center italic"
          >
            Bienvenid@ a MatricUDC
          </h1>
          <div className="w-full mb-28 bg-white bg-opacity-70 p-4 rounded-xl">
            <img src={udcLogo} alt="Logo UDC" className="w-full h-auto" />
          </div>
          {/* Animador que da efecto de transicion y muestra las frases */}
          <div className="relative w-full flex items-center justify-center py-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={indice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="
                px-4 text-center
                text-white text-2xl md:text-4xl
                font-body font-bold leading-snug
              "
              >
                {frases[indice]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </TransicionAnimada>
  );
}
