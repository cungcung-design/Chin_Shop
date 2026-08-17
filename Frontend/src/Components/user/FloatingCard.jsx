import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const FloatingCards = ({ children, floatDistance = 10, duration = 2, stagger = 0.2 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cards = el.children;

    gsap.to(cards, {
      y: `+=${floatDistance}`,
      duration: duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: stagger,
    });
  }, [floatDistance, duration, stagger]);

  return <div ref={containerRef}>{children}</div>;
};

export default FloatingCards;
