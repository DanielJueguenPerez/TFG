import { motion, AnimatePresence } from "framer-motion";

export default function TransicionAnimada ({ children, animationKey }) {
    return(
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
    );
}