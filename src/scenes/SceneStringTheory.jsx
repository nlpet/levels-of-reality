import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneStringTheory({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    let raf;
    const render = () => {
      const w = canvas.clientWidth * devicePixelRatio;
      const h = canvas.clientHeight * devicePixelRatio;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Title
      ctx.font = `${16 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText("STRING THEORY: Vibrating 1D Objects", cx, 30 * devicePixelRatio);

      // Draw multiple vibrating strings
      const numStrings = 3;
      const stringWidth = w * 0.6;
      const stringSpacing = h * 0.2;
      const startY = cy - stringSpacing;

      for (let s = 0; s < numStrings; s++) {
        const y = startY + s * stringSpacing;
        const phase = t * 0.5 + s * Math.PI * 0.7;
        const freq = 2 + s; // Different vibration modes

        // Draw string with sine wave
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${200 + s * 40}, 70%, 50%)`;
        ctx.lineWidth = 3 * devicePixelRatio;

        const numPoints = 100;
        for (let i = 0; i <= numPoints; i++) {
          const x = cx - stringWidth / 2 + (i / numPoints) * stringWidth;
          const amplitude = 20 * devicePixelRatio * (1 + s * 0.3);
          const offset = amplitude * Math.sin((i / numPoints) * Math.PI * freq + phase);
          if (i === 0) {
            ctx.moveTo(x, y + offset);
          } else {
            ctx.lineTo(x, y + offset);
          }
        }
        ctx.stroke();

        // Label each mode
        ctx.font = `${12 * devicePixelRatio}px sans-serif`;
        ctx.fillStyle = "#666";
        ctx.textAlign = "left";
        const labels = ["Graviton (spin-2)", "Photon (spin-1)", "Scalar"];
        ctx.fillText(
          labels[s],
          cx + stringWidth / 2 + 10 * devicePixelRatio,
          y
        );
      }

      // Draw dimension indicator
      ctx.font = `${14 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(
        "10D spacetime (9 space + 1 time)",
        cx,
        h - 50 * devicePixelRatio
      );
      ctx.fillText(
        "6 extra dimensions compactified at Planck scale",
        cx,
        h - 30 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
