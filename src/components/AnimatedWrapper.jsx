// components/AnimatedWrapper.jsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const transition = { duration: 0.4 };

const AnimatedWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={transition}
  >
    {children}
  </motion.div>
);

export default AnimatedWrapper;