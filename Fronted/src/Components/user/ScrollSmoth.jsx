"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();

  // Smooth spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150, // higher = snappier
    damping: 30,    // higher = slower
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX: scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        originX: 0,
        background: "linear-gradient(90deg, #c829bdff, #3c1b4dff)", // gradient animation
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", // subtle shadow
      }}
    />
  );
}
