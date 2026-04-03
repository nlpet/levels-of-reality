import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneQuantumGravity({ speed }) {
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
      const dpr = devicePixelRatio;

      // Title
      ctx.fillStyle = "#111";
      ctx.font = `bold ${14 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("THE PROBLEM: Classical Geometry ↔ Quantum Matter", w / 2, 25 * dpr);

      // LEFT: Smooth classical spacetime grid (GR side)
      const leftW = w * 0.45;
      const gridRows = 12, gridCols = 14;
      const cellW = leftW / gridCols;
      const cellH = (h * 0.6) / gridRows;
      const gridY = h * 0.15;

      ctx.fillStyle = "#3498DB";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("G_μν  (Geometry — classical, smooth)", leftW / 2, gridY - 10 * dpr);

      // Draw a smoothly curved grid (like a mass warping spacetime)
      const massX = leftW * 0.5;
      const massY = gridY + (h * 0.6) * 0.5;

      for (let j = 0; j <= gridRows; j++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(52, 152, 219, 0.5)";
        ctx.lineWidth = 1.2 * dpr;
        for (let i = 0; i <= gridCols; i++) {
          let x = i * cellW;
          let y = gridY + j * cellH;

          // Warp toward mass
          const dx = x - massX;
          const dy = y - massY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const warp = 2500 * dpr / (dist + 40 * dpr);
          x += (dx / dist) * warp * -0.3;
          y += (dy / dist) * warp * -0.3;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let i = 0; i <= gridCols; i++) {
        ctx.beginPath();
        for (let j = 0; j <= gridRows; j++) {
          let x = i * cellW;
          let y = gridY + j * cellH;
          const dx = x - massX;
          const dy = y - massY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const warp = 2500 * dpr / (dist + 40 * dpr);
          x += (dx / dist) * warp * -0.3;
          y += (dy / dist) * warp * -0.3;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Mass at center
      ctx.fillStyle = "#2c3e50";
      ctx.beginPath();
      ctx.arc(massX, massY, 12 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // EQUALS sign in middle
      const eqX = w * 0.48;
      ctx.fillStyle = "#c0392b";
      ctx.font = `bold ${28 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("=", eqX, h * 0.45);
      ctx.fillStyle = "#c0392b";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("8πG", eqX, h * 0.45 + 22 * dpr);

      // RIGHT: Quantum matter — fluctuating field
      const rightX = w * 0.52;
      const rightW = w * 0.45;

      ctx.fillStyle = "#E74C3C";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("T_μν  (Matter — quantum, fluctuating)", rightX + rightW / 2, gridY - 10 * dpr);

      // Draw quantum fluctuations as a jittery grid
      const qRows = 12, qCols = 14;
      const qCellW = rightW / qCols;
      const qCellH = (h * 0.6) / qRows;

      for (let j = 0; j <= qRows; j++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(231, 76, 60, 0.5)";
        ctx.lineWidth = 1.2 * dpr;
        for (let i = 0; i <= qCols; i++) {
          // Quantum fluctuations: jittery, scale-dependent noise
          const seed = i * 137 + j * 311;
          const jitterX = Math.sin(seed + t * 3) * 6 * dpr + Math.sin(seed * 2.7 + t * 7) * 3 * dpr;
          const jitterY = Math.cos(seed * 1.3 + t * 3) * 6 * dpr + Math.cos(seed * 3.1 + t * 7) * 3 * dpr;
          const x = rightX + i * qCellW + jitterX;
          const y = gridY + j * qCellH + jitterY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let i = 0; i <= qCols; i++) {
        ctx.beginPath();
        for (let j = 0; j <= qRows; j++) {
          const seed = i * 137 + j * 311;
          const jitterX = Math.sin(seed + t * 3) * 6 * dpr + Math.sin(seed * 2.7 + t * 7) * 3 * dpr;
          const jitterY = Math.cos(seed * 1.3 + t * 3) * 6 * dpr + Math.cos(seed * 3.1 + t * 7) * 3 * dpr;
          const x = rightX + i * qCellW + jitterX;
          const y = gridY + j * qCellH + jitterY;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Quantum particles on right
      for (let i = 0; i < 8; i++) {
        const seed = i * 73 + 17;
        const px = rightX + rightW * (0.15 + 0.7 * ((Math.sin(seed) + 1) / 2));
        const py = gridY + h * 0.6 * (0.15 + 0.7 * ((Math.cos(seed) + 1) / 2));
        const wobbleX = Math.sin(t * 2 + seed) * 8 * dpr;
        const wobbleY = Math.cos(t * 2.3 + seed) * 8 * dpr;
        ctx.fillStyle = `hsla(${i * 40}, 70%, 55%, 0.7)`;
        ctx.beginPath();
        ctx.arc(px + wobbleX, py + wobbleY, 5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Conflict indicator
      const conflictY = h * 0.82;
      ctx.fillStyle = "#c0392b";
      ctx.font = `bold ${13 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("⚠  Left side is smooth & continuous. Right side fluctuates wildly.", w / 2, conflictY);
      ctx.fillStyle = "#666";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.fillText("At the Planck scale (10⁻³⁵ m), quantum fluctuations tear the smooth fabric apart.", w / 2, conflictY + 20 * dpr);

      // Bottom
      ctx.fillStyle = "#111";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.fillText(
        "How do you make geometry quantum? Three approaches compete: strings, loops, emergence.",
        w / 2,
        h - 15 * dpr
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
