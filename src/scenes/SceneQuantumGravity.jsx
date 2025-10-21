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

      // Question mark in center
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.font = `bold ${100 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", w / 2, h / 2);

      // Three approaches shown as boxes
      const approaches = [
        { name: "String Theory", desc: "1D strings in 10D", x: 0.2, y: 0.3 },
        { name: "Loop QG", desc: "Spacetime loops", x: 0.5, y: 0.3 },
        { name: "Emergent Gravity", desc: "From entanglement", x: 0.8, y: 0.3 },
      ];

      approaches.forEach((app) => {
        const px = w * app.x;
        const py = h * app.y;
        const boxW = w * 0.15;
        const boxH = h * 0.15;

        // Box
        ctx.strokeStyle = "#3498DB";
        ctx.fillStyle = "rgba(52, 152, 219, 0.1)";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.fillRect(px - boxW / 2, py - boxH / 2, boxW, boxH);
        ctx.strokeRect(px - boxW / 2, py - boxH / 2, boxW, boxH);

        // Text
        ctx.fillStyle = "#111";
        ctx.font = `${12 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(app.name, px, py);
        ctx.font = `${10 * devicePixelRatio}px system-ui`;
        ctx.fillText(app.desc, px, py + 20 * devicePixelRatio);
      });

      // Einstein equation
      ctx.fillStyle = "#111";
      ctx.font = `${16 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("G_μν = 8πG T_μν", w / 2, h * 0.65);
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.fillText("(geometry) = (quantum matter)", w / 2, h * 0.65 + 25 * devicePixelRatio);
      ctx.fillText("⚠ Mismatch: left=classical, right=quantum", w / 2, h * 0.65 + 45 * devicePixelRatio);

      // Black hole hint
      ctx.fillStyle = "#666";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.fillText("Hints: black hole entropy ~ area", w / 2, h * 0.8);
      ctx.fillText("Holography: 3D physics ↔ 2D boundary", w / 2, h * 0.8 + 20 * devicePixelRatio);

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "THE FRONTIER. No experimental evidence yet. Maybe spacetime emerges from entanglement.",
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
