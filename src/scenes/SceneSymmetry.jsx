import React, { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneSymmetry({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let raf;

    const render = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio);
      const h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);

      const dpr = devicePixelRatio;

      // Title
      ctx.fillStyle = "#111";
      ctx.font = `bold ${15 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Noether's Theorem: Symmetry → Conservation", w / 2, h * 0.08);

      // Three symmetries displayed side by side
      const symmetries = [
        {
          title: "Time Symmetry",
          subtitle: "Physics doesn't change over time",
          conserved: "Energy",
          color: "#E74C3C",
          symbol: "E",
        },
        {
          title: "Space Symmetry",
          subtitle: "Physics same everywhere",
          conserved: "Momentum",
          color: "#3498DB",
          symbol: "p",
        },
        {
          title: "Rotation Symmetry",
          subtitle: "Physics same in all directions",
          conserved: "Angular Momentum",
          color: "#2ECC71",
          symbol: "L",
        },
      ];

      const boxWidth = w * 0.28;
      const boxHeight = h * 0.5;
      const startX = w * 0.06;
      const startY = h * 0.18;
      const spacing = (w - startX * 2 - boxWidth * 3) / 2;

      symmetries.forEach((sym, idx) => {
        const x = startX + idx * (boxWidth + spacing);
        const y = startY;

        // Draw box
        ctx.strokeStyle = sym.color;
        ctx.lineWidth = 2 * dpr;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // Title
        ctx.fillStyle = sym.color;
        ctx.font = `bold ${11 * dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(sym.title, x + boxWidth / 2, y - 10 * dpr);

        // Subtitle
        ctx.fillStyle = "#666";
        ctx.font = `${9 * dpr}px system-ui`;
        const words = sym.subtitle.split(" ");
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
        ctx.fillText(line1, x + boxWidth / 2, y + boxHeight * 0.15);
        ctx.fillText(line2, x + boxWidth / 2, y + boxHeight * 0.25);

        // Visual representation
        const centerX = x + boxWidth / 2;
        const centerY = y + boxHeight * 0.5;

        if (idx === 0) {
          // Time: clock face
          const r = boxWidth * 0.2;
          ctx.strokeStyle = sym.color;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();

          // Clock hand
          const angle = t * 2 - Math.PI / 2;
          ctx.strokeStyle = sym.color;
          ctx.lineWidth = 3 * dpr;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + r * 0.7 * Math.cos(angle), centerY + r * 0.7 * Math.sin(angle));
          ctx.stroke();
        } else if (idx === 1) {
          // Space: particle moving horizontally
          const particleX = centerX + Math.sin(t * 1.5) * boxWidth * 0.25;
          ctx.fillStyle = sym.color;
          ctx.beginPath();
          ctx.arc(particleX, centerY, 8 * dpr, 0, Math.PI * 2);
          ctx.fill();

          // Arrow showing motion
          ctx.strokeStyle = sym.color + "40";
          ctx.lineWidth = 2 * dpr;
          ctx.setLineDash([5 * dpr, 3 * dpr]);
          ctx.beginPath();
          ctx.moveTo(centerX - boxWidth * 0.3, centerY);
          ctx.lineTo(centerX + boxWidth * 0.3, centerY);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // Rotation: spinning object
          const r = boxWidth * 0.18;
          const angle = t * 1.5;

          // Rotating line
          ctx.strokeStyle = sym.color;
          ctx.lineWidth = 3 * dpr;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + r * Math.cos(angle), centerY + r * Math.sin(angle));
          ctx.stroke();

          // Circle showing rotation path
          ctx.strokeStyle = sym.color + "30";
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();

          // Dot at end
          ctx.fillStyle = sym.color;
          ctx.beginPath();
          ctx.arc(centerX + r * Math.cos(angle), centerY + r * Math.sin(angle), 5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Arrow down
        ctx.fillStyle = "#666";
        ctx.font = `bold ${20 * dpr}px system-ui`;
        ctx.fillText("↓", x + boxWidth / 2, y + boxHeight * 0.7);

        // Conserved quantity
        ctx.fillStyle = sym.color;
        ctx.font = `bold ${13 * dpr}px system-ui`;
        ctx.fillText(`${sym.conserved}`, x + boxWidth / 2, y + boxHeight * 0.85);

        ctx.fillStyle = "#666";
        ctx.font = `${10 * dpr}px system-ui`;
        ctx.fillText("Conserved", x + boxWidth / 2, y + boxHeight * 0.95);
      });

      // Mathematical statement at bottom
      const eqY = startY + boxHeight + h * 0.08;

      ctx.fillStyle = "#111";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Every continuous symmetry generates a conserved quantity",
        w / 2,
        eqY
      );

      ctx.fillStyle = "#8E44AD";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.fillText(
        "Energy generates time evolution: H → e^{-iHt/ℏ}",
        w / 2,
        eqY + 25 * dpr
      );

      ctx.fillStyle = "#666";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText(
        "Conservation isn't imposed—it emerges from symmetry structure",
        w / 2,
        eqY + 45 * dpr
      );

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
