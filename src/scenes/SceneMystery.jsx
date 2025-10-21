import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneMystery({ speed }) {
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

      // Draw multiple different clocks/periodic phenomena
      // Clock 1: Analog clock (top left)
      const c1x = w * 0.2, c1y = h * 0.25, r1 = Math.min(w, h) * 0.12;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(c1x, c1y, r1, 0, Math.PI * 2);
      ctx.stroke();
      const hour = (t * 0.3) % (2 * Math.PI);
      const minute = (t * 0.8) % (2 * Math.PI);
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c1x + r1 * 0.5 * Math.sin(hour), c1y - r1 * 0.5 * Math.cos(hour));
      ctx.stroke();
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c1x + r1 * 0.8 * Math.sin(minute), c1y - r1 * 0.8 * Math.cos(minute));
      ctx.stroke();

      // Clock 2: Pendulum (bottom left)
      const p2x = w * 0.25, p2y = h * 0.65;
      const swing = Math.sin(t * 1.2) * 0.6;
      const pendLen = Math.min(w, h) * 0.15;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(p2x, p2y);
      ctx.lineTo(p2x + pendLen * Math.sin(swing), p2y + pendLen * Math.cos(swing));
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p2x + pendLen * Math.sin(swing), p2y + pendLen * Math.cos(swing), 8 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();

      // Clock 3: Orbiting planet (right side)
      const orbitX = w * 0.7, orbitY = h * 0.4, orbitR = Math.min(w, h) * 0.18;
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 5 * devicePixelRatio]);
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, orbitR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      const orbitAngle = t * 0.5;
      const planetX = orbitX + orbitR * Math.cos(orbitAngle);
      const planetY = orbitY + orbitR * Math.sin(orbitAngle);
      ctx.fillStyle = "#E67E22";
      ctx.beginPath();
      ctx.arc(planetX, planetY, 8 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
      // Sun at center
      ctx.fillStyle = "#F39C12";
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, 12 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      // Clock 4: Heartbeat/pulse (bottom right)
      const pulseX = w * 0.7, pulseY = h * 0.75;
      const pulseW = w * 0.25;
      const pulse = Math.abs(Math.sin(t * 2)) > 0.7 ? 1 : 0;
      ctx.strokeStyle = "#C0392B";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      const steps = 50;
      for (let i = 0; i < steps; i++) {
        const x = pulseX - pulseW / 2 + (i / steps) * pulseW;
        const phase = (i / steps) * 4 * Math.PI - t * 2;
        const y = pulseY + Math.sin(phase) * 20 * devicePixelRatio * Math.exp(-Math.abs(i - steps / 2) / 10);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Central mystery text
      const qx = w * 0.5, qy = h * 0.45;
      ctx.fillStyle = "#c0392b";
      ctx.font = `bold ${20 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("What GENERATES time?", qx, qy - 20 * devicePixelRatio);

      ctx.fillStyle = "#666";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText("Without it, the universe would be frozen.", qx, qy + 15 * devicePixelRatio);

      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.font = `bold ${60 * devicePixelRatio}px system-ui`;
      ctx.fillText("?", qx, qy + 60 * devicePixelRatio);

      // Caption
      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "All these clocks tick. But what's the underlying mechanism? There must be something more fundamental...",
        w / 2,
        h - 20 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
