import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneEmergentGravity({ speed }) {
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
      ctx.fillText("EMERGENT GRAVITY: Spacetime from Entanglement", cx, 30 * devicePixelRatio);

      // Draw entangled qubit network
      const numQubits = 12;
      const radius = 120 * devicePixelRatio;
      const qubits = [];
      for (let i = 0; i < numQubits; i++) {
        const angle = (i / numQubits) * Math.PI * 2;
        qubits.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        });
      }

      // Draw entanglement threads (thicker = more entanglement = closer in emergent space)
      for (let i = 0; i < numQubits; i++) {
        for (let j = i + 1; j < numQubits; j++) {
          const distance = Math.abs(i - j);
          const wrappedDist = Math.min(distance, numQubits - distance);
          const entanglement = 1 / (1 + wrappedDist * 0.5);

          if (entanglement > 0.3) {
            const phase = Math.sin(t * 0.2 + i + j) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.moveTo(qubits[i].x, qubits[i].y);
            ctx.lineTo(qubits[j].x, qubits[j].y);
            ctx.strokeStyle = `rgba(155, 89, 182, ${entanglement * phase * 0.5})`;
            ctx.lineWidth = entanglement * 4 * devicePixelRatio;
            ctx.stroke();
          }
        }
      }

      // Draw qubits
      qubits.forEach((q, idx) => {
        const phase = Math.sin(t * 0.5 + idx * 0.5) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(142, 68, 173, ${phase})`;
        ctx.fill();
        ctx.strokeStyle = "#8e44ad";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.stroke();
      });

      // Center label
      ctx.font = `${14 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#8e44ad";
      ctx.textAlign = "center";
      ctx.fillText("ER = EPR", cx, cy);
      ctx.font = `${11 * devicePixelRatio}px sans-serif`;
      ctx.fillText("Wormhole ≈ Entanglement", cx, cy + 18 * devicePixelRatio);

      // Info text
      ctx.font = `${13 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(
        "Distance = 1 / (entanglement strength)",
        cx,
        h - 50 * devicePixelRatio
      );
      ctx.fillText(
        "Spacetime is emergent illusion — entanglement is fundamental",
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
