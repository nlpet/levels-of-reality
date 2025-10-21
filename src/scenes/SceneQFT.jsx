import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneQFT({ speed }) {
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

      // Background field (continuous field permeating space)
      const gridSize = 20 * devicePixelRatio;
      ctx.strokeStyle = "rgba(100, 100, 100, 0.15)";
      ctx.lineWidth = 0.5 * devicePixelRatio;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.fillStyle = "#666";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Quantum Field (permeates all space)", w / 2, 25 * devicePixelRatio);

      // Particles as localized excitations
      const particles = [
        { x: 0.25, y: 0.4, phase: 0, label: "e⁻" },
        { x: 0.5, y: 0.5, phase: 1, label: "γ" },
        { x: 0.75, y: 0.35, phase: 2, label: "e⁺" },
      ];

      particles.forEach((p, idx) => {
        const px = w * p.x;
        const py = h * p.y;

        // Wave packet visualization
        const waveR = 60 * devicePixelRatio;
        for (let r = 0; r < waveR; r += 3 * devicePixelRatio) {
          const phase = p.phase * Math.PI / 2 + r * 0.1 - t;
          const amplitude = Math.exp(-((r / waveR) ** 2) * 3) * Math.sin(phase * 3);
          const alpha = (1 - r / waveR) * 0.5 * (amplitude + 1) / 2;

          ctx.strokeStyle = `rgba(52, 152, 219, ${alpha})`;
          ctx.lineWidth = 2 * devicePixelRatio;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Core particle
        ctx.fillStyle = "#E74C3C";
        ctx.beginPath();
        ctx.arc(px, py, 8 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#111";
        ctx.font = `${14 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(p.label, px, py + waveR + 20 * devicePixelRatio);
      });

      // Show the quantization explicitly
      const opY = h * 0.75;
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Second Quantization:", w / 2, opY - 25 * devicePixelRatio);

      // Arrows showing creation
      ctx.strokeStyle = "#27ae60";
      ctx.lineWidth = 3 * devicePixelRatio;
      const arrow1X = w * 0.3;
      const arrow2X = w * 0.7;
      ctx.beginPath();
      ctx.moveTo(arrow1X, opY);
      ctx.lineTo(arrow2X, opY);
      ctx.stroke();
      // Arrowhead
      ctx.fillStyle = "#27ae60";
      ctx.beginPath();
      ctx.moveTo(arrow2X, opY);
      ctx.lineTo(arrow2X - 12 * devicePixelRatio, opY - 8 * devicePixelRatio);
      ctx.lineTo(arrow2X - 12 * devicePixelRatio, opY + 8 * devicePixelRatio);
      ctx.fill();

      // Labels
      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("|0⟩", arrow1X - 30 * devicePixelRatio, opY + 5 * devicePixelRatio);
      ctx.fillText("(vacuum)", arrow1X - 30 * devicePixelRatio, opY + 20 * devicePixelRatio);

      ctx.fillStyle = "#27ae60";
      ctx.font = `bold ${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("a†", (arrow1X + arrow2X) / 2, opY - 10 * devicePixelRatio);
      ctx.font = `${10 * devicePixelRatio}px system-ui`;
      ctx.fillText("(creation operator)", (arrow1X + arrow2X) / 2, opY + 25 * devicePixelRatio);

      ctx.fillStyle = "#e74c3c";
      ctx.font = `bold ${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("|1⟩", arrow2X + 30 * devicePixelRatio, opY + 5 * devicePixelRatio);
      ctx.fillStyle = "#111";
      ctx.font = `${10 * devicePixelRatio}px system-ui`;
      ctx.fillText("(one particle)", arrow2X + 30 * devicePixelRatio, opY + 20 * devicePixelRatio);

      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Aha! Particles are DISCRETE quanta of field excitation. The field itself is quantized.",
        w / 2,
        h - 24 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
