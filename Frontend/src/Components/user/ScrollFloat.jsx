import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollFloatSection = ({
  children,
  animationDuration = 2,
  ease = "power1.inOut",
  scrollStart = "top bottom",
  scrollEnd = "bottom top",
  floatDistance = 20,    // vertical float distance
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Vertical float for the entire section
    gsap.to(el, {
      y: floatDistance,
      duration: animationDuration,
      ease: ease,
      scrollTrigger: {
        trigger: el,
        start: scrollStart,
        end: scrollEnd,
        scrub: true,
      },
      yoyo: true,
      repeat: -1,
    });
  }, [animationDuration, ease, scrollStart, scrollEnd, floatDistance]);

  return <div ref={containerRef}>{children}</div>;
};

export default ScrollFloatSection;
