import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneStringTheory({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let raf;
    const render = () => {
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      // Title
      ctx.font = `bold ${15 * dpr}px system-ui`;
      ctx.fillStyle = "#111";
      ctx.textAlign = "center";
      ctx.fillText("STRING THEORY: Particles as Vibrating Strings", w / 2, 28 * dpr);

      // === LEFT: Open strings (different vibration modes) ===
      const leftW = w * 0.45;
      const stringY0 = h * 0.18;

      ctx.fillStyle = "#3498DB";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Open Strings", leftW / 2, stringY0 - 5 * dpr);

      const modes = [
        { n: 1, label: "Ground mode", particle: "Scalar / Tachyon", color: "#3498DB" },
        { n: 2, label: "First harmonic", particle: "Photon (spin-1)", color: "#2ECC71" },
        { n: 3, label: "Second harmonic", particle: "Massive state", color: "#9B59B6" },
      ];

      const stringW = leftW * 0.6;
      const stringSpacing = h * 0.2;

      modes.forEach((mode, idx) => {
        const cy = stringY0 + 30 * dpr + idx * stringSpacing;
        const startX = (leftW - stringW) / 2;

        // Draw vibrating open string
        ctx.beginPath();
        ctx.strokeStyle = mode.color;
        ctx.lineWidth = 3 * dpr;

        const numPts = 80;
        for (let i = 0; i <= numPts; i++) {
          const frac = i / numPts;
          const x = startX + frac * stringW;
          // Standing wave: sin(nπx/L) * cos(ωt)
          const amplitude = 18 * dpr;
          const y = cy + amplitude * Math.sin(mode.n * Math.PI * frac) * Math.cos(t * (1 + mode.n * 0.5));
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Endpoints (fixed for open strings)
        ctx.fillStyle = mode.color;
        ctx.beginPath();
        ctx.arc(startX, cy, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(startX + stringW, cy, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = "#666";
        ctx.font = `${10 * dpr}px system-ui`;
        ctx.textAlign = "left";
        ctx.fillText(`n=${mode.n}: ${mode.label}`, startX + stringW + 12 * dpr, cy - 6 * dpr);
        ctx.fillStyle = mode.color;
        ctx.font = `bold ${10 * dpr}px system-ui`;
        ctx.fillText(`→ ${mode.particle}`, startX + stringW + 12 * dpr, cy + 10 * dpr);
      });

      // === RIGHT: Closed string (graviton!) ===
      const rightX = w * 0.52;
      const rightW = w * 0.45;
      const loopCx = rightX + rightW * 0.45;
      const loopCy = h * 0.42;
      const loopR = Math.min(rightW, h) * 0.2;

      ctx.fillStyle = "#E74C3C";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Closed String", loopCx, stringY0 - 5 * dpr);

      // Draw vibrating closed string (loop)
      ctx.beginPath();
      ctx.strokeStyle = "#E74C3C";
      ctx.lineWidth = 3.5 * dpr;
      const loopPts = 100;
      for (let i = 0; i <= loopPts; i++) {
        const angle = (i / loopPts) * Math.PI * 2;
        // Spin-2 vibration mode (graviton has quadrupole pattern)
        const vibration = loopR * 0.15 * Math.cos(2 * angle - t * 1.5) +
                          loopR * 0.08 * Math.cos(4 * angle + t * 2);
        const r = loopR + vibration;
        const x = loopCx + r * Math.cos(angle);
        const y = loopCy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Graviton label with emphasis
      ctx.fillStyle = "#E74C3C";
      ctx.font = `bold ${13 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("GRAVITON", loopCx, loopCy);
      ctx.fillStyle = "#666";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("spin-2 mode", loopCx, loopCy + 14 * dpr);

      // Arrow showing gravity emerges
      ctx.fillStyle = "#E74C3C";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.fillText("Gravity emerges automatically", loopCx, loopCy + loopR + 30 * dpr);
      ctx.fillText("from closed string vibrations!", loopCx, loopCy + loopR + 45 * dpr);

      // Point particle comparison
      const compY = h * 0.78;
      ctx.fillStyle = "#111";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Why strings?", w / 2, compY - 5 * dpr);

      // Point particle → divergence
      ctx.fillStyle = "#999";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.fillText("Point particle interactions → ∞ (divergent)", w * 0.3, compY + 15 * dpr);
      ctx.fillText("String interactions → finite (smooth)", w * 0.7, compY + 15 * dpr);

      // Draw interaction diagrams
      // Point: two lines meeting at a point
      const ptY = compY + 40 * dpr;
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, ptY - 15 * dpr);
      ctx.lineTo(w * 0.3, ptY);
      ctx.lineTo(w * 0.2, ptY + 15 * dpr);
      ctx.moveTo(w * 0.4, ptY - 15 * dpr);
      ctx.lineTo(w * 0.3, ptY);
      ctx.lineTo(w * 0.4, ptY + 15 * dpr);
      ctx.stroke();
      ctx.fillStyle = "#c0392b";
      ctx.font = `bold ${14 * dpr}px system-ui`;
      ctx.fillText("×", w * 0.3, ptY + 3 * dpr);

      // String: smooth pants diagram (two tubes merging)
      ctx.strokeStyle = "#27ae60";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      // Left tube
      ctx.ellipse(w * 0.65, ptY - 12 * dpr, 8 * dpr, 12 * dpr, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w * 0.65, ptY + 12 * dpr, 8 * dpr, 12 * dpr, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Right merged tube
      ctx.beginPath();
      ctx.ellipse(w * 0.78, ptY, 10 * dpr, 18 * dpr, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Connecting lines
      ctx.beginPath();
      ctx.moveTo(w * 0.65 + 8 * dpr, ptY - 12 * dpr);
      ctx.quadraticCurveTo(w * 0.72, ptY - 8 * dpr, w * 0.78 - 10 * dpr, ptY - 5 * dpr);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.65 + 8 * dpr, ptY + 12 * dpr);
      ctx.quadraticCurveTo(w * 0.72, ptY + 8 * dpr, w * 0.78 - 10 * dpr, ptY + 5 * dpr);
      ctx.stroke();
      ctx.fillStyle = "#27ae60";
      ctx.font = `bold ${14 * dpr}px system-ui`;
      ctx.fillText("✓", w * 0.72, ptY + 3 * dpr);

      // Bottom
      ctx.fillStyle = "#666";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Requires 10D spacetime (6 extra dimensions compactified). No experimental evidence after 40+ years.",
        w / 2, h - 15 * dpr
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
