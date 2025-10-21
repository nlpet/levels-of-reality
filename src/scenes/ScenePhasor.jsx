import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function ScenePhasor({ omega, speed }) {
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

      // Three phasors representing different energy states
      const phasors = [
        { label: "Low E", omega: 0.3, color: "#2ECC71", cx: w * 0.25, cy: h * 0.35 },
        { label: "Med E", omega: 0.6, color: "#3498DB", cx: w * 0.5, cy: h * 0.35 },
        { label: "High E", omega: 1.0, color: "#E74C3C", cx: w * 0.75, cy: h * 0.35 },
      ];

      const r = Math.min(w, h) * 0.15;

      phasors.forEach((phasor) => {
        // Circle
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(phasor.cx, phasor.cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating phasor
        const phi = 2 * Math.PI * phasor.omega * t;
        const x = phasor.cx + r * Math.cos(phi);
        const y = phasor.cy + r * Math.sin(phi);

        ctx.strokeStyle = phasor.color;
        ctx.lineWidth = 3 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(phasor.cx, phasor.cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = phasor.color;
        ctx.beginPath();
        ctx.arc(x, y, 5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#111";
        ctx.font = `${12 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(phasor.label, phasor.cx, phasor.cy - r - 15 * devicePixelRatio);
        ctx.fillText(`ω = E/ℏ`, phasor.cx, phasor.cy + r + 25 * devicePixelRatio);
      });

      // Clock metaphor at bottom
      const clockCx = w * 0.5, clockCy = h * 0.75, clockR = Math.min(w, h) * 0.12;

      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Every quantum state IS a clock", clockCx, clockCy - clockR - 20 * devicePixelRatio);

      // Clock face
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(clockCx, clockCy, clockR, 0, Math.PI * 2);
      ctx.stroke();

      // Tick marks
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = clockCx + clockR * 0.85 * Math.cos(angle);
        const y1 = clockCy + clockR * 0.85 * Math.sin(angle);
        const x2 = clockCx + clockR * 0.95 * Math.cos(angle);
        const y2 = clockCy + clockR * 0.95 * Math.sin(angle);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Clock hand (phase)
      const clockPhi = 2 * Math.PI * omega * t;
      const handX = clockCx + clockR * 0.7 * Math.cos(clockPhi - Math.PI / 2);
      const handY = clockCy + clockR * 0.7 * Math.sin(clockPhi - Math.PI / 2);

      ctx.strokeStyle = "#C0392B";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(clockCx, clockCy);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.fillStyle = "#C0392B";
      ctx.beginPath();
      ctx.arc(clockCx, clockCy, 4 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      // Emphatic revelation
      ctx.fillStyle = "#c0392b";
      ctx.font = `bold ${16 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "THIS IS TIME ITSELF.",
        w / 2,
        h - 55 * devicePixelRatio
      );

      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "ψ(t) = Ae^{-iEt/ℏ}. Phase rotates at ω = E/ℏ. Every quantum state is an internal clock.",
        w / 2,
        h - 35 * devicePixelRatio
      );
      ctx.fillStyle = "#666";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "No deeper mechanism. This rotation IS the flow of time. Everything else emerges from this.",
        w / 2,
        h - 18 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, omega]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
