import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneArrowOfTime({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);

  // Persistent particle state
  const particlesRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current,
      ctx = c.getContext("2d");

    // Initialize particles once
    if (!particlesRef.current) {
      const numParticles = 30;
      particlesRef.current = [];
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: 0.3 + Math.random() * 0.1, // Start clustered on left
          y: 0.3 + Math.random() * 0.4,
          vx: (Math.random() - 0.5) * 0.002,
          vy: (Math.random() - 0.5) * 0.002
        });
      }
    }

    let raf;
    const render = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio),
        h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);

      // Update particles (REVERSIBLE dynamics)
      const particles = particlesRef.current;
      particles.forEach(p => {
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Elastic bounce (perfectly reversible!)
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        p.x = Math.max(0, Math.min(1, p.x));
        p.y = Math.max(0, Math.min(1, p.y));
      });

      // Title
      ctx.fillStyle = "#111";
      ctx.font = `bold ${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("ARROW OF TIME: Reversible Micro → Irreversible Macro", w / 2, 25 * devicePixelRatio);

      // Split view: Microstate (left) vs Macrostate (right)
      const boxWidth = w * 0.4;
      const boxHeight = h * 0.5;
      const leftX = w * 0.05;
      const rightX = w * 0.55;
      const boxY = h * 0.15;

      // === LEFT: MICROSTATE VIEW (every particle matters) ===
      ctx.strokeStyle = "#3498db";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.strokeRect(leftX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("MICROSTATE", leftX + boxWidth / 2, boxY - 10 * devicePixelRatio);
      ctx.font = `${9 * devicePixelRatio}px system-ui`;
      ctx.fillStyle = "#666";
      ctx.fillText("(exact positions)", leftX + boxWidth / 2, boxY - 25 * devicePixelRatio);

      // Draw every particle precisely
      particles.forEach(p => {
        const px = leftX + p.x * boxWidth;
        const py = boxY + p.y * boxHeight;
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(px, py, 3 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Show velocity arrow
        ctx.strokeStyle = "#95a5a6";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + p.vx * 5000 * devicePixelRatio, py + p.vy * 5000 * devicePixelRatio);
        ctx.stroke();
      });

      ctx.fillStyle = "#666";
      ctx.font = `${9 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Dynamics: REVERSIBLE", leftX + boxWidth / 2, boxY + boxHeight + 15 * devicePixelRatio);
      ctx.fillText("(reverse all velocities → goes backward)", leftX + boxWidth / 2, boxY + boxHeight + 28 * devicePixelRatio);

      // === RIGHT: MACROSTATE VIEW (only coarse-grained info) ===
      ctx.strokeStyle = "#e67e22";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.strokeRect(rightX, boxY, boxWidth, boxHeight);

      // Draw dividing line
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 5 * devicePixelRatio]);
      ctx.beginPath();
      ctx.moveTo(rightX + boxWidth / 2, boxY);
      ctx.lineTo(rightX + boxWidth / 2, boxY + boxHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("MACROSTATE", rightX + boxWidth / 2, boxY - 10 * devicePixelRatio);
      ctx.font = `${9 * devicePixelRatio}px system-ui`;
      ctx.fillStyle = "#666";
      ctx.fillText("(coarse-grained: L vs R)", rightX + boxWidth / 2, boxY - 25 * devicePixelRatio);

      // Count particles in left vs right half
      let countLeft = 0, countRight = 0;
      particles.forEach(p => {
        if (p.x < 0.5) countLeft++;
        else countRight++;
      });

      // Draw density bars
      const barWidth = boxWidth * 0.35;
      const maxBarHeight = boxHeight * 0.8;
      const leftBarHeight = (countLeft / particles.length) * maxBarHeight;
      const rightBarHeight = (countRight / particles.length) * maxBarHeight;

      // Left bar
      ctx.fillStyle = "#3498db";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(
        rightX + boxWidth * 0.15,
        boxY + maxBarHeight - leftBarHeight + boxHeight * 0.1,
        barWidth,
        leftBarHeight
      );

      // Right bar
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(
        rightX + boxWidth * 0.5,
        boxY + maxBarHeight - rightBarHeight + boxHeight * 0.1,
        barWidth,
        rightBarHeight
      );
      ctx.globalAlpha = 1.0;

      // Labels
      ctx.fillStyle = "#111";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(`L: ${countLeft}`, rightX + boxWidth * 0.325, boxY + boxHeight - 10 * devicePixelRatio);
      ctx.fillText(`R: ${countRight}`, rightX + boxWidth * 0.675, boxY + boxHeight - 10 * devicePixelRatio);

      // Compute entropy (approximately)
      const entropy = -((countLeft / particles.length) * Math.log(Math.max(0.01, countLeft / particles.length)) +
                       (countRight / particles.length) * Math.log(Math.max(0.01, countRight / particles.length)));

      ctx.fillStyle = "#e67e22";
      ctx.font = `bold ${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(`S = ${entropy.toFixed(2)} k_B`, rightX + boxWidth / 2, boxY + boxHeight + 20 * devicePixelRatio);

      // Arrow showing increase
      if (countLeft > countRight + 3) {
        ctx.fillStyle = "#c0392b";
        ctx.font = `${11 * devicePixelRatio}px system-ui`;
        ctx.fillText("→ S increases (spreading)", rightX + boxWidth / 2, boxY + boxHeight + 35 * devicePixelRatio);
      } else if (Math.abs(countLeft - countRight) < 4) {
        ctx.fillStyle = "#27ae60";
        ctx.font = `${11 * devicePixelRatio}px system-ui`;
        ctx.fillText("✓ Equilibrium (max S)", rightX + boxWidth / 2, boxY + boxHeight + 35 * devicePixelRatio);
      }

      // Bottom explanation
      ctx.fillStyle = "#111";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Aha! Micro-laws are reversible, but MACRO-evolution (L→R count) is irreversible because there are vastly more high-S states.",
        w / 2,
        h - 20 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, speed]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
