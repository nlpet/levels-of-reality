import React, { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneStandardModel({ speed }) {
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
      const centerX = w / 2;
      const startY = h * 0.12;
      const rowHeight = h * 0.18;

      // Title
      ctx.fillStyle = "#111";
      ctx.font = `bold ${16 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("The Standard Model: Catalog of Reality", centerX, startY - 15 * dpr);

      // Three generations of matter
      const genWidth = w * 0.28;
      const genStartX = w * 0.05;

      for (let gen = 0; gen < 3; gen++) {
        const x = genStartX + gen * (genWidth + w * 0.02);
        const y = startY + rowHeight * 0.5;

        // Generation box
        ctx.strokeStyle = "#3498DB";
        ctx.lineWidth = 2 * dpr;
        ctx.strokeRect(x, y, genWidth, rowHeight * 1.4);

        // Label
        ctx.fillStyle = "#3498DB";
        ctx.font = `bold ${12 * dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(`Generation ${gen + 1}`, x + genWidth / 2, y - 8 * dpr);

        // Quarks (up-type, down-type)
        const quarks = [
          ["u", "d"],
          ["c", "s"],
          ["t", "b"],
        ];
        const qSize = 20 * dpr;
        const qY1 = y + rowHeight * 0.3;
        const qY2 = y + rowHeight * 0.7;

        // Up-type quark
        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(x + genWidth * 0.25 - qSize / 2, qY1 - qSize / 2, qSize, qSize);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${10 * dpr}px system-ui`;
        ctx.fillText(quarks[gen][0], x + genWidth * 0.25, qY1 + 4 * dpr);

        // Down-type quark
        ctx.fillStyle = "#C0392B";
        ctx.fillRect(x + genWidth * 0.25 - qSize / 2, qY2 - qSize / 2, qSize, qSize);
        ctx.fillStyle = "#fff";
        ctx.fillText(quarks[gen][1], x + genWidth * 0.25, qY2 + 4 * dpr);

        // Leptons (charged, neutrino)
        const leptons = [
          ["e", "νₑ"],
          ["μ", "νμ"],
          ["τ", "ντ"],
        ];

        // Charged lepton
        ctx.fillStyle = "#2ECC71";
        ctx.beginPath();
        ctx.arc(x + genWidth * 0.75, qY1, qSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${10 * dpr}px system-ui`;
        ctx.fillText(leptons[gen][0], x + genWidth * 0.75, qY1 + 4 * dpr);

        // Neutrino
        ctx.fillStyle = "#27AE60";
        ctx.beginPath();
        ctx.arc(x + genWidth * 0.75, qY2, qSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = `${9 * dpr}px system-ui`;
        ctx.fillText(leptons[gen][1], x + genWidth * 0.75, qY2 + 3 * dpr);

        // Labels
        ctx.fillStyle = "#666";
        ctx.font = `${9 * dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText("Quarks", x + genWidth * 0.25, y + rowHeight * 1.5);
        ctx.fillText("Leptons", x + genWidth * 0.75, y + rowHeight * 1.5);
      }

      // Force carriers section
      const forceY = startY + rowHeight * 2.3;
      const forceBoxWidth = w * 0.9;
      const forceBoxX = w * 0.05;

      ctx.strokeStyle = "#9B59B6";
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(forceBoxX, forceY, forceBoxWidth, rowHeight * 0.9);

      ctx.fillStyle = "#9B59B6";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Force Carriers (Bosons)", centerX, forceY - 8 * dpr);

      // Draw force carriers
      const bosons = [
        { name: "γ", label: "Photon", force: "EM", color: "#F1C40F" },
        { name: "W±,Z", label: "W/Z", force: "Weak", color: "#E67E22" },
        { name: "g", label: "Gluon", force: "Strong", color: "#E74C3C" },
        { name: "H", label: "Higgs", force: "Mass", color: "#8E44AD" },
      ];

      const bosonSpacing = forceBoxWidth / (bosons.length + 1);

      bosons.forEach((boson, i) => {
        const bx = forceBoxX + bosonSpacing * (i + 1);
        const by = forceY + rowHeight * 0.45;

        // Animated wavy line for bosons
        const wavePhase = t * 2 + i * Math.PI * 0.5;
        ctx.strokeStyle = boson.color;
        ctx.lineWidth = 3 * dpr;
        ctx.beginPath();
        for (let j = 0; j < 30; j++) {
          const px = bx - 15 * dpr + j * dpr;
          const py = by + Math.sin(wavePhase + j * 0.3) * 8 * dpr;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Label
        ctx.fillStyle = boson.color;
        ctx.font = `bold ${11 * dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(boson.name, bx, by - 20 * dpr);

        ctx.fillStyle = "#666";
        ctx.font = `${9 * dpr}px system-ui`;
        ctx.fillText(boson.force, bx, by + 25 * dpr);
      });

      // Bottom summary
      ctx.fillStyle = "#111";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "17 fundamental fields: 12 matter (quarks + leptons) + 4 forces + Higgs",
        centerX,
        h - 30 * dpr
      );

      ctx.fillStyle = "#C0392B";
      ctx.font = `bold ${10 * dpr}px system-ui`;
      ctx.fillText(
        "Missing: Gravity (still classical), Dark Matter, Neutrino masses",
        centerX,
        h - 12 * dpr
      );

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
