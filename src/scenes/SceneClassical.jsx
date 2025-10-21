import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneClassical({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current,
      ctx = c.getContext("2d");
    let raf;
    const render = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio),
        h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);
      for (let j = 0; j < 60; j++) {
        for (let i = 0; i < 120; i++) {
          const val = Math.sin(0.2 * i - 0.7 * t) * Math.cos(0.2 * j + 0.5 * t);
          const g = 180 + 30 * val;
          ctx.fillStyle = `rgba(${g},${g},${g},0.18)`;
          ctx.fillRect((i / 120) * w, (j / 60) * h, w / 120 + 1, h / 60 + 1);
        }
      }
      const cx = w * 0.55,
        cy = h * 0.55,
        R = h * 0.28;
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1.5 * devicePixelRatio;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R, R * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      const theta = t * 0.6;
      const px = cx + R * Math.cos(theta);
      const py = cy + R * 0.7 * Math.sin(theta);
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(px, py, 6 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
      const kx = w * 0.18,
        ky = h * 0.2,
        r = Math.min(w, h) * 0.08;
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.arc(kx, ky, r, 0, Math.PI * 2);
      ctx.stroke();
      const th = (t * 0.2) % (2 * Math.PI),
        tm = (t * 0.6) % (2 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(kx, ky);
      ctx.lineTo(
        kx + r * 0.6 * Math.cos(th - Math.PI / 2),
        ky + r * 0.6 * Math.sin(th - Math.PI / 2)
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(kx, ky);
      ctx.lineTo(
        kx + r * 0.9 * Math.cos(tm - Math.PI / 2),
        ky + r * 0.9 * Math.sin(tm - Math.PI / 2)
      );
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Decohered macro: trajectories & clocks atop faint phase fabric.",
        16 * devicePixelRatio,
        h - 24 * devicePixelRatio
      );
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
