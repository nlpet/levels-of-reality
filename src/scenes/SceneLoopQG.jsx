import { useEffect, useRef, useMemo } from "react";
import { useTicker } from "../utils/hooks";

export function SceneLoopQG({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);

  // Pre-compute spin network graph
  const graph = useMemo(() => {
    // Irregular graph representing quantized space
    const nodes = [
      { x: 0.20, y: 0.25 }, { x: 0.40, y: 0.18 }, { x: 0.60, y: 0.22 },
      { x: 0.80, y: 0.28 }, { x: 0.15, y: 0.45 }, { x: 0.35, y: 0.40 },
      { x: 0.55, y: 0.38 }, { x: 0.75, y: 0.42 }, { x: 0.90, y: 0.45 },
      { x: 0.25, y: 0.62 }, { x: 0.45, y: 0.58 }, { x: 0.65, y: 0.55 },
      { x: 0.85, y: 0.60 }, { x: 0.20, y: 0.78 }, { x: 0.42, y: 0.75 },
      { x: 0.60, y: 0.72 }, { x: 0.78, y: 0.76 },
    ];
    // Edges with spin quantum numbers (j = 1/2, 1, 3/2, 2)
    const edges = [
      [0, 1, 0.5], [1, 2, 1], [2, 3, 0.5], [0, 4, 1], [1, 5, 1.5],
      [2, 6, 1], [3, 7, 0.5], [3, 8, 1], [4, 5, 0.5], [5, 6, 1],
      [6, 7, 1.5], [7, 8, 1], [4, 9, 1], [5, 10, 0.5], [6, 11, 1],
      [7, 12, 0.5], [9, 10, 1.5], [10, 11, 1], [11, 12, 0.5],
      [9, 13, 1], [10, 14, 0.5], [11, 15, 1], [12, 16, 1.5],
      [13, 14, 1], [14, 15, 0.5], [15, 16, 1],
    ];
    // Triangular faces for area visualization
    const faces = [
      [0, 1, 5], [0, 4, 5], [1, 2, 6], [1, 5, 6], [2, 3, 7], [2, 6, 7],
      [4, 5, 10], [4, 9, 10], [5, 6, 10], [6, 7, 11], [6, 10, 11], [7, 8, 12], [7, 11, 12],
      [9, 10, 14], [9, 13, 14], [10, 11, 15], [10, 14, 15], [11, 12, 16], [11, 15, 16],
      [13, 14, 15], [14, 15, 16],
    ];
    return { nodes, edges, faces };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let raf;

    const render = () => {
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      // Title
      ctx.font = `bold ${15 * dpr}px system-ui`;
      ctx.fillStyle = "#111";
      ctx.textAlign = "center";
      ctx.fillText("LOOP QUANTUM GRAVITY: Spin Networks", w / 2, 28 * dpr);

      const gx = w * 0.03, gy = h * 0.1, gw = w * 0.94, gh = h * 0.65;

      // Compute node positions with gentle breathing animation
      const nodePos = graph.nodes.map((n, idx) => {
        const breathe = 0.005 * Math.sin(t * 0.4 + idx * 1.7);
        return {
          x: gx + (n.x + breathe * Math.cos(idx * 2.3)) * gw,
          y: gy + (n.y + breathe * Math.sin(idx * 1.9)) * gh,
        };
      });

      // Draw faces (area quanta) with color based on enclosed spin
      graph.faces.forEach((face, idx) => {
        const [a, b, c] = face;
        // Area of face ~ sum of surrounding edge spins
        const area = 0.5 + Math.sin(t * 0.3 + idx * 0.7) * 0.15;

        ctx.fillStyle = `rgba(52, 152, 219, ${0.06 + area * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(nodePos[a].x, nodePos[a].y);
        ctx.lineTo(nodePos[b].x, nodePos[b].y);
        ctx.lineTo(nodePos[c].x, nodePos[c].y);
        ctx.closePath();
        ctx.fill();
      });

      // Draw edges with width proportional to spin quantum number
      graph.edges.forEach(([i, j, spin], idx) => {
        const na = nodePos[i], nb = nodePos[j];

        // Animated flow along edges (spin foam evolution)
        const flowPhase = (t * 0.6 + idx * 0.3) % 1;
        const flowX = na.x + (nb.x - na.x) * flowPhase;
        const flowY = na.y + (nb.y - na.y) * flowPhase;

        // Edge line (thickness ~ spin)
        ctx.strokeStyle = `rgba(41, 128, 185, ${0.4 + spin * 0.15})`;
        ctx.lineWidth = (1 + spin * 1.8) * dpr;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();

        // Flow particle
        ctx.fillStyle = `rgba(52, 152, 219, ${0.6})`;
        ctx.beginPath();
        ctx.arc(flowX, flowY, (1 + spin) * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Spin label at edge midpoint
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        ctx.fillStyle = "rgba(41, 128, 185, 0.7)";
        ctx.font = `${8 * dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(`j=${spin}`, mx, my - 5 * dpr);
      });

      // Draw nodes (vertices of spin network)
      nodePos.forEach((n, idx) => {
        // Pulse when "excited"
        const pulse = 1 + 0.15 * Math.sin(t * 0.8 + idx * 2.1);
        const r = 5 * dpr * pulse;

        ctx.fillStyle = "#2c3e50";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.fillStyle = "rgba(52, 152, 219, 0.2)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Info section
      const infoY = h * 0.8;

      ctx.fillStyle = "#111";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Space is discrete at the Planck scale", w / 2, infoY);

      ctx.fillStyle = "#666";
      ctx.font = `${11 * dpr}px system-ui`;

      // Area quantization
      ctx.fillText(
        "Edge spins (j) determine quantized AREA: A = 8πγℓ²_P Σ√(j(j+1))",
        w / 2, infoY + 20 * dpr
      );
      ctx.fillText(
        "Triangular faces = smallest chunks of area. Nodes = volume quanta.",
        w / 2, infoY + 38 * dpr
      );

      ctx.fillStyle = "#999";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText(
        "No background spacetime, no extra dimensions. Geometry IS the quantum variable.",
        w / 2, h - 12 * dpr
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, graph]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
