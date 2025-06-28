import Header from "./Header";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const location = useLocation();
  const landingPage = location.pathname === "/";
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      {!landingPage && (
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
          <div className="absolute top-[28%] left-1/2 transform -translate-x-1/2 w-[80vw] h-[500px] rounded-full bg-[rgba(109,40,217,0.5)] opacity-50 blur-[120px]"></div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
