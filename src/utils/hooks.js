import { useEffect, useState } from "react";

export function useTicker(speed = 1) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0,
      last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => v + dt * speed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);
  return t;
}
