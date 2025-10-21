import { useEffect, useRef, useState } from "react";
import { useTicker } from "../utils/hooks";

export function ScenePathIntegral({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  const [pathData] = useState(() => {
    // Pre-compute paths so they're stable
    const V = (x) => 0.5 * (x * x - 1) * (x * x - 1) + 0.15 * Math.cos(3 * x);
    const numPaths = 50;
    const steps = 40;
    const x0 = -1.2, x1 = 1.2, T = 1.6;
    const m = 1, dt = T / (steps - 1);

    return Array.from({ length: numPaths }, () => {
      let xs = [x0];
      for (let s = 1; s < steps - 1; s++) {
        const prev = xs[s - 1];
        const drift = (x1 - x0) / steps;
        xs.push(prev + drift + 0.12 * (Math.random() - 0.5));
      }
      xs.push(x1);

      let S = 0;
      for (let s = 1; s < steps; s++) {
        const dx = xs[s] - xs[s - 1];
        const xmid = 0.5 * (xs[s] + xs[s - 1]);
        const L = 0.5 * m * (dx / dt) * (dx / dt) - V(xmid);
        S += L * dt;
      }
      return { xs, S, V };
    });
  });

  useEffect(() => {
    const cvs = canvasRef.current,
      ctx = cvs.getContext("2d");
    let raf;
    const render = () => {
      const w = (cvs.width = cvs.clientWidth * devicePixelRatio),
        h = (cvs.height = cvs.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);

      const mainW = w * 0.7;

      // Draw potential on left
      const V = pathData[0].V;
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.beginPath();
      for (let i = 0; i < mainW; i++) {
        const x = (i / mainW) * 4 - 2;
        const y = V(x);
        const py = h * 0.78 - y * 80 * devicePixelRatio;
        if (i === 0) ctx.moveTo(i, py);
        else ctx.lineTo(i, py);
      }
      ctx.stroke();

      // Find classical path first
      let minS = Infinity, minIdx = 0;
      pathData.forEach((p, i) => {
        if (Math.abs(p.S) < Math.abs(minS)) {
          minS = p.S;
          minIdx = i;
        }
      });

      // Draw non-classical paths first
      pathData.forEach((path, idx) => {
        if (idx === minIdx) return; // Skip classical, draw it last

        const phi = path.S;
        const hue = ((((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 360;
        ctx.strokeStyle = `hsla(${hue},100%,50%,0.3)`;
        ctx.lineWidth = 1.2 * devicePixelRatio;
        ctx.beginPath();
        for (let s = 0; s < path.xs.length; s++) {
          const i = s / (path.xs.length - 1);
          const px = i * mainW;
          const py = h * 0.78 - V(path.xs[s]) * 80 * devicePixelRatio - 100 * devicePixelRatio;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Draw classical path LAST (on top, thicker, green)
      const classicalPath = pathData[minIdx];
      ctx.strokeStyle = "#27ae60";
      ctx.lineWidth = 4 * devicePixelRatio;
      ctx.beginPath();
      for (let s = 0; s < classicalPath.xs.length; s++) {
        const i = s / (classicalPath.xs.length - 1);
        const px = i * mainW;
        const py = h * 0.78 - V(classicalPath.xs[s]) * 80 * devicePixelRatio - 100 * devicePixelRatio;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Phasor sum diagram on the right
      const phasorCx = w * 0.85, phasorCy = h * 0.45, phasorR = Math.min(w, h) * 0.12;

      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Phasor Sum", phasorCx, phasorCy - phasorR - 20 * devicePixelRatio);

      // Circle
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(phasorCx, phasorCy, phasorR, 0, Math.PI * 2);
      ctx.stroke();

      // Add phasors tip-to-tail
      let sumX = 0, sumY = 0;
      const scale = phasorR / (pathData.length * 0.3);

      pathData.forEach((path, idx) => {
        const phi = path.S;
        const phasorLen = scale;
        const dx = phasorLen * Math.cos(phi);
        const dy = phasorLen * Math.sin(phi);

        const hue = ((((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 360;
        ctx.strokeStyle = `hsla(${hue},100%,50%,0.3)`;
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(phasorCx + sumX, phasorCy + sumY);
        ctx.lineTo(phasorCx + sumX + dx, phasorCy + sumY + dy);
        ctx.stroke();

        sumX += dx;
        sumY += dy;
      });

      // Final resultant (thick arrow)
      ctx.strokeStyle = "#C0392B";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(phasorCx, phasorCy);
      ctx.lineTo(phasorCx + sumX, phasorCy + sumY);
      ctx.stroke();

      ctx.fillStyle = "#C0392B";
      ctx.beginPath();
      ctx.arc(phasorCx + sumX, phasorCy + sumY, 4 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#666";
      ctx.font = `${10 * devicePixelRatio}px system-ui`;
      ctx.fillText("= Net amplitude", phasorCx, phasorCy + phasorR + 30 * devicePixelRatio);

      // Label classical path
      ctx.fillStyle = "#27ae60";
      ctx.font = `bold ${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("← Green = Classical path", mainW * 0.6, h * 0.2);
      ctx.font = `${10 * devicePixelRatio}px system-ui`;
      ctx.fillText("(stationary action)", mainW * 0.6, h * 0.2 + 18 * devicePixelRatio);

      ctx.fillStyle = "#111";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Aha! Paths with wildly different S have oscillating phases → cancel. Near-classical paths reinforce.",
        16 * devicePixelRatio,
        h - 24 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, pathData]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
