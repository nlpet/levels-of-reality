import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneWave1D({ speed }) {
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
      const N = 48,
        margin = 40 * devicePixelRatio,
        innerW = w - 2 * margin,
        innerH = h - 2 * margin,
        yMid = h / 2;
      const k1 = (2 * Math.PI) / (innerW / 6);
      const k2 = (2 * Math.PI) / (innerW / 5.5);
      const omega = 1.2;
      for (let i = 0; i < N; i++) {
        const x = margin + (i / (N - 1)) * innerW;
        const A1 = Math.exp(-Math.pow((x - w * 0.35) / (innerW * 0.15), 2));
        const A2 = Math.exp(-Math.pow((x - w * 0.65) / (innerW * 0.15), 2));
        const phase =
          k1 * x - omega * t + 0.4 * Math.sin(0.3 * x) + k2 * x * 0.2;
        const phase2 = k2 * x + omega * 0.8 * t + 0.2 * Math.cos(0.25 * x);
        const Re = A1 * Math.cos(phase) + A2 * Math.cos(phase2);
        const Im = A1 * Math.sin(phase) + A2 * Math.sin(phase2);
        const mag = Math.sqrt(Re * Re + Im * Im) + 1e-6;
        const angle = Math.atan2(Im, Re);
        const len = innerH * 0.35 * (mag / 1.2);
        const x2 = x + len * Math.cos(angle),
          y2 = yMid - len * Math.sin(angle);
        ctx.strokeStyle = "#bbb";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(x, yMid);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(x2, y2, 2.5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = margin + (i / (N - 1)) * innerW;
        const A1 = Math.exp(-Math.pow((x - w * 0.35) / (innerW * 0.15), 2));
        const A2 = Math.exp(-Math.pow((x - w * 0.65) / (innerW * 0.15), 2));
        const phase =
          k1 * x - omega * t + 0.4 * Math.sin(0.3 * x) + k2 * x * 0.2;
        const phase2 = k2 * x + omega * 0.8 * t + 0.2 * Math.cos(0.25 * x);
        const Re = A1 * Math.cos(phase) + A2 * Math.cos(phase2);
        const Im = A1 * Math.sin(phase) + A2 * Math.sin(phase2);
        const mag2 = Math.min(1.2, Re * Re + Im * Im);
        const y = yMid - innerH * 0.4 * mag2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Row of phasors ψ(x). Angle = phase; length ∝ |ψ|.",
        margin,
        margin * 0.7
      );
      ctx.fillText(
        "Bold curve ≈ |ψ|^2 envelope (toy)",
        margin,
        h - margin * 0.5
      );
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
