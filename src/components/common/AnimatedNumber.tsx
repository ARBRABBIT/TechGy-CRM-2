import React, { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

/**
 * Counts from the previously shown value to `value` with an ease-out curve.
 * Renders the final value immediately when the user prefers reduced motion.
 */
export default function AnimatedNumber({ value, duration = 700 }) {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? target : 0));
  const currentRef = useRef(display);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target || prefersReducedMotion()) {
      currentRef.current = target;
      setDisplay(target);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      currentRef.current = Math.round(from + (target - from) * eased);
      setDisplay(currentRef.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return <>{display.toLocaleString('en-IN')}</>;
}
