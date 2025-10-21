import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneSpacetime({ speed }) {
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

      // Spacetime diagram (Minkowski)
      const cx = w * 0.3, cy = h * 0.6;
      const axisLen = Math.min(w, h) * 0.35;

      // Axes
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      // Time axis (vertical)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - axisLen);
      ctx.stroke();
      // Space axis (horizontal)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + axisLen, cy);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("ct", cx, cy - axisLen - 15 * devicePixelRatio);
      ctx.fillText("x", cx + axisLen + 20 * devicePixelRatio, cy);

      // Light cone
      ctx.strokeStyle = "rgba(255, 200, 0, 0.5)";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + axisLen * 0.7, cy - axisLen * 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - axisLen * 0.7, cy - axisLen * 0.7);
      ctx.stroke();

      ctx.fillStyle = "#F39C12";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.fillText("light cone", cx + axisLen * 0.5, cy - axisLen * 0.5 - 10 * devicePixelRatio);

      // Worldline
      const worldlinePoints = 20;
      ctx.strokeStyle = "#E74C3C";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      for (let i = 0; i < worldlinePoints; i++) {
        const frac = i / worldlinePoints;
        const x = cx + axisLen * 0.3 * Math.sin(frac * Math.PI * 2 + t * 0.5) * frac;
        const y = cy - axisLen * frac * 0.9;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#E74C3C";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText("worldline", cx + 30 * devicePixelRatio, cy - axisLen * 0.5);

      // Proper time formula
      const boxX = w * 0.65, boxY = h * 0.3;
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Proper time τ:", boxX, boxY);
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("dτ² = dt² - dx²/c²", boxX, boxY + 30 * devicePixelRatio);
      ctx.fillText("Phase = ∫ mc² dτ / ℏ", boxX, boxY + 60 * devicePixelRatio);

      // Unification message
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("Space + Time = Spacetime", boxX, boxY + 100 * devicePixelRatio);

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Phase accumulation encodes both time AND space. But where does metric g_μν come from?",
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
