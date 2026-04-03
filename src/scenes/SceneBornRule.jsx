import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneBornRule({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  const histRef = useRef({ up: 0, down: 0, lastMeasure: 0, total: 0, showing: "super" });

  useEffect(() => {
    const c = canvasRef.current,
      ctx = c.getContext("2d");
    let raf;

    // Probabilities: |0.6|² = 0.36, |0.8|² = 0.64
    const pUp = 0.36;

    const render = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio),
        h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);
      const dpr = devicePixelRatio;
      const hist = histRef.current;
      const now = t * speed;

      // Perform a "measurement" every ~0.8 seconds
      if (now - hist.lastMeasure > 0.8 && hist.total < 200) {
        hist.lastMeasure = now;
        if (Math.random() < pUp) hist.up++;
        else hist.down++;
        hist.total = hist.up + hist.down;
      }

      // Title
      ctx.fillStyle = "#111";
      ctx.font = `bold ${15 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("THE BORN RULE: Why |ψ|² = Probability?", w / 2, 28 * dpr);

      // === LEFT: The state and measurement ===
      const leftW = w * 0.4;

      // Superposition state
      const cx = leftW * 0.5;
      const stateY = h * 0.2;

      ctx.fillStyle = "#111";
      ctx.font = `${13 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("|ψ⟩ = 0.6|↑⟩ + 0.8|↓⟩", cx, stateY);

      // Visual: spinning coin-like superposition
      const coinY = h * 0.38;
      const coinR = 35 * dpr;
      const spinPhase = t * 3;

      // Squished circle (coin spinning)
      const squish = Math.cos(spinPhase);
      ctx.save();
      ctx.translate(cx, coinY);
      ctx.scale(squish, 1);

      if (squish > 0) {
        // Show up face
        ctx.fillStyle = "rgba(39, 174, 96, 0.3)";
        ctx.strokeStyle = "#27ae60";
      } else {
        // Show down face
        ctx.fillStyle = "rgba(231, 76, 60, 0.3)";
        ctx.strokeStyle = "#e74c3c";
      }
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, coinR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = squish > 0 ? "#27ae60" : "#e74c3c";
      ctx.font = `bold ${18 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(squish > 0 ? "↑" : "↓", 0, 0);
      ctx.restore();
      ctx.textBaseline = "alphabetic";

      // Probability breakdown
      const probY = h * 0.58;
      ctx.fillStyle = "#111";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Born rule: P = |amplitude|²", cx, probY - 15 * dpr);

      // Up probability bar
      const barX = cx - 80 * dpr;
      const barW = 160 * dpr;
      const barH = 22 * dpr;

      ctx.fillStyle = "rgba(39, 174, 96, 0.3)";
      ctx.fillRect(barX, probY, barW * pUp, barH);
      ctx.strokeStyle = "#27ae60";
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(barX, probY, barW * pUp, barH);

      ctx.fillStyle = "rgba(231, 76, 60, 0.3)";
      ctx.fillRect(barX + barW * pUp, probY, barW * (1 - pUp), barH);
      ctx.strokeStyle = "#e74c3c";
      ctx.strokeRect(barX + barW * pUp, probY, barW * (1 - pUp), barH);

      ctx.fillStyle = "#27ae60";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("|0.6|²=36%", barX + barW * pUp / 2, probY + barH / 2 + 4 * dpr);
      ctx.fillStyle = "#e74c3c";
      ctx.fillText("|0.8|²=64%", barX + barW * pUp + barW * (1 - pUp) / 2, probY + barH / 2 + 4 * dpr);

      // === RIGHT: Accumulating histogram ===
      const rightX = w * 0.45;
      const rightW = w * 0.52;
      const histX = rightX + rightW * 0.1;
      const histW = rightW * 0.8;
      const histTop = h * 0.15;
      const histH = h * 0.55;

      ctx.fillStyle = "#111";
      ctx.font = `bold ${13 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(`Repeated measurements (n = ${hist.total})`, rightX + rightW / 2, histTop - 5 * dpr);

      // Axes
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(histX, histTop);
      ctx.lineTo(histX, histTop + histH);
      ctx.lineTo(histX + histW, histTop + histH);
      ctx.stroke();

      if (hist.total > 0) {
        const maxCount = Math.max(hist.up, hist.down, 1);
        const barGap = histW * 0.1;
        const singleBarW = (histW - barGap * 3) / 2;

        // Up bar
        const upH = (hist.up / maxCount) * histH * 0.85;
        ctx.fillStyle = "rgba(39, 174, 96, 0.6)";
        ctx.fillRect(histX + barGap, histTop + histH - upH, singleBarW, upH);
        ctx.strokeStyle = "#27ae60";
        ctx.lineWidth = 2 * dpr;
        ctx.strokeRect(histX + barGap, histTop + histH - upH, singleBarW, upH);

        // Down bar
        const downH = (hist.down / maxCount) * histH * 0.85;
        ctx.fillStyle = "rgba(231, 76, 60, 0.6)";
        ctx.fillRect(histX + barGap * 2 + singleBarW, histTop + histH - downH, singleBarW, downH);
        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 2 * dpr;
        ctx.strokeRect(histX + barGap * 2 + singleBarW, histTop + histH - downH, singleBarW, downH);

        // Labels
        ctx.font = `${11 * dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#27ae60";
        const upPct = ((hist.up / hist.total) * 100).toFixed(1);
        ctx.fillText(`↑ ${hist.up}  (${upPct}%)`, histX + barGap + singleBarW / 2, histTop + histH + 18 * dpr);
        ctx.fillStyle = "#e74c3c";
        const downPct = ((hist.down / hist.total) * 100).toFixed(1);
        ctx.fillText(`↓ ${hist.down}  (${downPct}%)`, histX + barGap * 2 + singleBarW * 1.5, histTop + histH + 18 * dpr);

        // Expected line
        ctx.setLineDash([4 * dpr, 4 * dpr]);
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1.5 * dpr;

        // Expected up height (relative to maxCount)
        const expectedUp = hist.total * pUp;
        const expectedDown = hist.total * (1 - pUp);
        const expUpH = (expectedUp / maxCount) * histH * 0.85;
        const expDownH = (expectedDown / maxCount) * histH * 0.85;

        ctx.beginPath();
        ctx.moveTo(histX + barGap, histTop + histH - expUpH);
        ctx.lineTo(histX + barGap + singleBarW, histTop + histH - expUpH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(histX + barGap * 2 + singleBarW, histTop + histH - expDownH);
        ctx.lineTo(histX + barGap * 2 + singleBarW * 2, histTop + histH - expDownH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#999";
        ctx.font = `${9 * dpr}px system-ui`;
        ctx.textAlign = "left";
        ctx.fillText("— expected (|ψ|²)", histX + histW + 5 * dpr, histTop + histH - expDownH);
      }

      // The mystery
      const mysteryY = h * 0.85;
      ctx.fillStyle = "#c0392b";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Statistics converge to |ψ|². But WHY this rule?", w / 2, mysteryY);
      ctx.fillStyle = "#666";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.fillText(
        "Gleason's theorem: it's the ONLY consistent probability measure on Hilbert space (dim ≥ 3).",
        w / 2, mysteryY + 18 * dpr
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, speed]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
