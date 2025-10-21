import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneLoopQG({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    let raf;
    const render = () => {
      const w = canvas.clientWidth * devicePixelRatio;
      const h = canvas.clientHeight * devicePixelRatio;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Title
      ctx.font = `${16 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText("LOOP QUANTUM GRAVITY: Spin Networks", cx, 30 * devicePixelRatio);

      // Create a spin network (graph with nodes and edges)
      const nodes = [
        { x: cx, y: cy - 80 * devicePixelRatio },
        { x: cx - 100 * devicePixelRatio, y: cy },
        { x: cx + 100 * devicePixelRatio, y: cy },
        { x: cx - 60 * devicePixelRatio, y: cy + 80 * devicePixelRatio },
        { x: cx + 60 * devicePixelRatio, y: cy + 80 * devicePixelRatio },
        { x: cx, y: cy + 20 * devicePixelRatio },
      ];

      const edges = [
        [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 5], [2, 5]
      ];

      const spins = [0.5, 1, 1.5, 1, 0.5, 1, 1.5, 1]; // spin labels

      // Draw edges (loops) with spin labels
      edges.forEach((edge, idx) => {
        const [i, j] = edge;
        const phase = Math.sin(t * 0.3 + idx) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(52, 152, 219, ${0.3 + phase * 0.4})`;
        ctx.lineWidth = (2 + spins[idx] * 2) * devicePixelRatio;
        ctx.stroke();

        // Label spin
        const mx = (nodes[i].x + nodes[j].x) / 2;
        const my = (nodes[i].y + nodes[j].y) / 2;
        ctx.font = `${10 * devicePixelRatio}px sans-serif`;
        ctx.fillStyle = "#2980b9";
        ctx.textAlign = "center";
        ctx.fillText(`j=${spins[idx]}`, mx, my - 5 * devicePixelRatio);
      });

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = "#2c3e50";
        ctx.fill();
      });

      // Info text
      ctx.font = `${13 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(
        "Area & volume are quantized: A ~ ℓ_P²",
        cx,
        h - 50 * devicePixelRatio
      );
      ctx.fillText(
        "No background spacetime — geometry IS the quantum field",
        cx,
        h - 30 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
