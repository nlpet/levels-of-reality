import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneBornRule({ speed }) {
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

      // Simple animated demo: electron spin measurement
      const cycleTime = 6; // seconds
      const phase = (t * speed * 0.3) % cycleTime;

      // Before measurement: superposition
      const cx = w / 2;
      const cy = h * 0.35;

      // Title
      ctx.fillStyle = "#111";
      ctx.font = `bold ${16 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("MEASUREMENT MYSTERY", cx, 30 * devicePixelRatio);

      if (phase < cycleTime / 2) {
        // BEFORE: Superposition
        ctx.fillStyle = "#666";
        ctx.font = `${13 * devicePixelRatio}px system-ui`;
        ctx.fillText("BEFORE measurement:", cx, 70 * devicePixelRatio);

        // Electron
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Both spins shown as ghostly arrows
        const arrowLen = 60 * devicePixelRatio;

        // Up arrow
        ctx.strokeStyle = "#27ae60";
        ctx.lineWidth = 4 * devicePixelRatio;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - arrowLen);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = "#27ae60";
        ctx.beginPath();
        ctx.moveTo(cx, cy - arrowLen);
        ctx.lineTo(cx - 8 * devicePixelRatio, cy - arrowLen + 15 * devicePixelRatio);
        ctx.lineTo(cx + 8 * devicePixelRatio, cy - arrowLen + 15 * devicePixelRatio);
        ctx.fill();

        // Down arrow
        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 4 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy + arrowLen);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.moveTo(cx, cy + arrowLen);
        ctx.lineTo(cx - 8 * devicePixelRatio, cy + arrowLen - 15 * devicePixelRatio);
        ctx.lineTo(cx + 8 * devicePixelRatio, cy + arrowLen - 15 * devicePixelRatio);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Label
        ctx.fillStyle = "#111";
        ctx.font = `${12 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText("|ψ⟩ = 0.6|↑⟩ + 0.8|↓⟩", cx, cy + arrowLen + 40 * devicePixelRatio);
        ctx.fillStyle = "#666";
        ctx.font = `${11 * devicePixelRatio}px system-ui`;
        ctx.fillText("(both exist simultaneously)", cx, cy + arrowLen + 60 * devicePixelRatio);

        // Probabilities
        const probY = h * 0.75;
        ctx.fillStyle = "#111";
        ctx.font = `${12 * devicePixelRatio}px system-ui`;
        ctx.fillText("Possible outcomes:", cx, probY - 30 * devicePixelRatio);

        // Up bar
        ctx.fillStyle = "#27ae60";
        ctx.globalAlpha = 0.3;
        const upWidth = 100 * devicePixelRatio;
        ctx.fillRect(cx - 150 * devicePixelRatio, probY - 20 * devicePixelRatio, upWidth, 30 * devicePixelRatio);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#27ae60";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.strokeRect(cx - 150 * devicePixelRatio, probY - 20 * devicePixelRatio, upWidth, 30 * devicePixelRatio);
        ctx.fillStyle = "#27ae60";
        ctx.fillText("P(↑) = 36%", cx - 100 * devicePixelRatio, probY);

        // Down bar
        ctx.fillStyle = "#e74c3c";
        ctx.globalAlpha = 0.3;
        const downWidth = 140 * devicePixelRatio;
        ctx.fillRect(cx + 50 * devicePixelRatio, probY - 20 * devicePixelRatio, downWidth, 30 * devicePixelRatio);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.strokeRect(cx + 50 * devicePixelRatio, probY - 20 * devicePixelRatio, downWidth, 30 * devicePixelRatio);
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("P(↓) = 64%", cx + 120 * devicePixelRatio, probY);

      } else {
        // AFTER: Measurement collapsed to ONE outcome
        ctx.fillStyle = "#666";
        ctx.font = `${13 * devicePixelRatio}px system-ui`;
        ctx.fillText("AFTER measurement:", cx, 70 * devicePixelRatio);

        // Electron
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Only DOWN arrow (collapsed)
        const arrowLen = 60 * devicePixelRatio;
        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 6 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy + arrowLen);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.moveTo(cx, cy + arrowLen);
        ctx.lineTo(cx - 10 * devicePixelRatio, cy + arrowLen - 18 * devicePixelRatio);
        ctx.lineTo(cx + 10 * devicePixelRatio, cy + arrowLen - 18 * devicePixelRatio);
        ctx.fill();

        // Label
        ctx.fillStyle = "#e74c3c";
        ctx.font = `bold ${14 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText("Result: SPIN DOWN", cx, cy + arrowLen + 40 * devicePixelRatio);

        // The mystery
        const mysteryY = h * 0.75;
        ctx.fillStyle = "#c0392b";
        ctx.font = `bold ${15 * devicePixelRatio}px system-ui`;
        ctx.fillText("Why only ONE outcome?", cx, mysteryY - 20 * devicePixelRatio);
        ctx.font = `${13 * devicePixelRatio}px system-ui`;
        ctx.fillText("Why THIS one (not ↑)?", cx, mysteryY + 10 * devicePixelRatio);
        ctx.fillStyle = "#666";
        ctx.font = `${11 * devicePixelRatio}px system-ui`;
        ctx.fillText("Decoherence explains no interference,", cx, mysteryY + 35 * devicePixelRatio);
        ctx.fillText("but NOT why we see ONE result or P=|ψ|²", cx, mysteryY + 50 * devicePixelRatio);
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, speed]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
