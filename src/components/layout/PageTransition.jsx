import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const PageTransition = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -20,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: [0.22, 1, 0.36, 1],
    duration: shouldReduceMotion ? 0.2 : 0.45,
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
