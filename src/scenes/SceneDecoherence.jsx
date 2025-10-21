import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneDecoherence({ speed }) {
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

      // Split screen: left = coherent superposition, right = decohered
      const mid = w / 2;

      // Left side: Interference pattern (coherent)
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("COHERENT", 16 * devicePixelRatio, 30 * devicePixelRatio);

      const slitY = h * 0.3;
      const screenX = mid * 0.75;

      // Two slits
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(mid * 0.2, slitY - 60 * devicePixelRatio);
      ctx.lineTo(mid * 0.2, slitY - 20 * devicePixelRatio);
      ctx.moveTo(mid * 0.2, slitY + 20 * devicePixelRatio);
      ctx.lineTo(mid * 0.2, slitY + 60 * devicePixelRatio);
      ctx.stroke();

      // Interference pattern on left
      for (let y = 0; y < h; y += 3 * devicePixelRatio) {
        const dy = y - slitY;
        const interference = Math.cos((dy / (h * 0.08)) * Math.PI + t * 0.5);
        const intensity = Math.max(0, interference);
        const brightness = 100 + intensity * 120;
        ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.8}, ${brightness * 0.6})`;
        ctx.fillRect(screenX, y, mid * 0.2, 3 * devicePixelRatio);
      }

      // Divider
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 5 * devicePixelRatio]);
      ctx.beginPath();
      ctx.moveTo(mid, 0);
      ctx.lineTo(mid, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right side: Decohered (two classical blobs)
      ctx.fillStyle = "#111";
      ctx.fillText("DECOHERED", mid + 16 * devicePixelRatio, 30 * devicePixelRatio);

      // Two distinct peaks (no interference)
      const peak1Y = slitY - 35 * devicePixelRatio;
      const peak2Y = slitY + 35 * devicePixelRatio;
      const screenX2 = mid + mid * 0.55;

      for (let y = 0; y < h; y += 3 * devicePixelRatio) {
        const dist1 = Math.abs(y - peak1Y);
        const dist2 = Math.abs(y - peak2Y);
        const gauss1 = Math.exp(-(dist1 * dist1) / (800 * devicePixelRatio * devicePixelRatio));
        const gauss2 = Math.exp(-(dist2 * dist2) / (800 * devicePixelRatio * devicePixelRatio));
        const intensity = gauss1 + gauss2;
        const brightness = 100 + intensity * 120;
        ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.8}, ${brightness * 0.6})`;
        ctx.fillRect(screenX2, y, mid * 0.2, 3 * devicePixelRatio);
      }

      // Environment particles causing decoherence (small dots flying around on right)
      const numParticles = 30;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + t * 0.8;
        const radius = 80 * devicePixelRatio + 40 * devicePixelRatio * Math.sin(t * 1.2 + i);
        const px = mid + mid * 0.3 + radius * Math.cos(angle);
        const py = slitY + radius * Math.sin(angle);
        ctx.fillStyle = "rgba(200, 100, 100, 0.5)";
        ctx.beginPath();
        ctx.arc(px, py, 3 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      // Label environment
      ctx.fillStyle = "#c0392b";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Environment particles", mid + mid * 0.3, slitY - 90 * devicePixelRatio);
      ctx.fillText("entangle with system", mid + mid * 0.3, slitY - 75 * devicePixelRatio);
      ctx.fillText("→ scramble phases", mid + mid * 0.3, slitY - 60 * devicePixelRatio);

      // Caption
      ctx.fillStyle = "#111";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Aha! Environment entanglement erases phase relations → interference pattern disappears → classical probabilities emerge.",
        w / 2,
        h - 24 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
