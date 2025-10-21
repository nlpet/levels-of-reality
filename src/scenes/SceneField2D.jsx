import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneField2D({ speed }) {
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

      // Split view: discrete oscillators on left, continuous field on right
      const mid = w / 2;

      // Left: Discrete oscillators
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("DISCRETE OSCILLATORS", 16 * devicePixelRatio, 30 * devicePixelRatio);

      const gridCols = 12, gridRows = 8;
      const cellW = mid / (gridCols + 1);
      const cellH = h / (gridRows + 1);

      for (let j = 0; j < gridRows; j++) {
        for (let i = 0; i < gridCols; i++) {
          const cx = cellW * (i + 1);
          const cy = cellH * (j + 1);
          const x = (i / gridCols) * 4 * Math.PI;
          const y = (j / gridRows) * 4 * Math.PI;

          // Wave packet traveling through
          const packetX = (t * 0.5) % (4 * Math.PI);
          const packetY = 2 * Math.PI;
          const dist = Math.sqrt((x - packetX) ** 2 + (y - packetY) ** 2);
          const amplitude = Math.exp(-dist * 0.8);

          const phase = x - t * 1.5;
          const val = amplitude * Math.sin(phase);

          // Draw oscillator as circle with phasor
          const radius = 8 * devicePixelRatio;
          const phasorLen = radius * 0.8;
          const phasorAngle = phase;

          // Circle
          ctx.strokeStyle = "#999";
          ctx.lineWidth = 1 * devicePixelRatio;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Phasor
          const phasorX = cx + phasorLen * Math.cos(phasorAngle) * amplitude;
          const phasorY = cy + phasorLen * Math.sin(phasorAngle) * amplitude;
          ctx.strokeStyle = `rgba(0, 100, 200, ${0.3 + amplitude * 0.7})`;
          ctx.lineWidth = 2 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(phasorX, phasorY);
          ctx.stroke();

          ctx.fillStyle = `rgba(0, 100, 200, ${0.3 + amplitude * 0.7})`;
          ctx.beginPath();
          ctx.arc(phasorX, phasorY, 2 * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Divider with arrow
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 5 * devicePixelRatio]);
      ctx.beginPath();
      ctx.moveTo(mid, 0);
      ctx.lineTo(mid, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow pointing right
      const arrowY = h * 0.5;
      ctx.fillStyle = "#666";
      ctx.font = `${20 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("→", mid, arrowY);
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("continuum limit", mid, arrowY + 25 * devicePixelRatio);

      // Right: Continuous field
      ctx.textAlign = "left";
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("CONTINUOUS FIELD", mid + 16 * devicePixelRatio, 30 * devicePixelRatio);

      const cols = 60, rows = 40;
      const dx = (w - mid) / cols;
      const dy = h / rows;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i / cols) * 4 * Math.PI;
          const y = (j / rows) * 4 * Math.PI;

          const packetX = (t * 0.5) % (4 * Math.PI);
          const packetY = 2 * Math.PI;
          const dist = Math.sqrt((x - packetX) ** 2 + (y - packetY) ** 2);
          const amplitude = Math.exp(-dist * 0.8);

          const phase = x - t * 1.5;
          const val = amplitude * Math.sin(phase);

          const brightness = 125 + val * 100;
          const hue = 200;
          const sat = 50 + amplitude * 50;
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${brightness / 2.55}%)`;
          ctx.fillRect(mid + i * dx, j * dy, dx + 1, dy + 1);
        }
      }

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Dense network → smooth field. Localized coherent excitation = 'particle'.",
        16 * devicePixelRatio,
        h - 24 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
