import { useEffect, useMemo, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneNetwork({ speed, couple }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  const graph = useMemo(() => {
    const N = 20;
    const nodes = Array.from({ length: N }, (_, i) => ({
      id: i,
      x: Math.cos((i / N) * Math.PI * 2),
      y: Math.sin((i / N) * Math.PI * 2),
      phi0: (i / N) * Math.PI * 0.5, // Some initial phase structure
      omega: 0.8,
    }));
    const edges = [];
    const add = (a, b, w) => {
      if (a !== b) edges.push({ a, b, w });
    };
    // Ring connections
    for (let i = 0; i < N; i++) {
      add(i, (i + 1) % N, 0.8);
    }
    // Cross connections
    for (let k = 0; k < N; k++) {
      if (k % 3 === 0) add(k, (k + 7) % N, 0.4);
    }
    // Entangled pair (opposite sides of circle)
    const entangled = [5, 15];
    add(entangled[0], entangled[1], 1.0);

    return { nodes, edges, entangled };
  }, []);

  useEffect(() => {
    const c = canvasRef.current,
      ctx = c.getContext("2d");
    let raf;
    const render = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio),
        h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2,
        R = Math.min(w, h) * 0.35;

      // Draw edges with animated amplitude flow
      graph.edges.forEach((e) => {
        const na = graph.nodes[e.a],
          nb = graph.nodes[e.b];
        const ax = cx + R * na.x,
          ay = cy + R * na.y,
          bx = cx + R * nb.x,
          by = cy + R * nb.y;

        const isEntangled = (e.a === graph.entangled[0] && e.b === graph.entangled[1]) ||
                           (e.a === graph.entangled[1] && e.b === graph.entangled[0]);

        // Base edge
        ctx.strokeStyle = isEntangled ? "#C0392B" : "#bbb";
        ctx.globalAlpha = 0.2 + 0.6 * e.w * couple;
        ctx.lineWidth = isEntangled ? 2 * devicePixelRatio : 1.2 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Amplitude flow animation (particles moving along edge)
        if (couple > 0.3) {
          const flowPhase = (t * 2 + e.a * 0.5) % 1;
          const fx = ax + (bx - ax) * flowPhase;
          const fy = ay + (by - ay) * flowPhase;
          ctx.fillStyle = isEntangled ? "rgba(192, 57, 43, 0.8)" : "rgba(52, 152, 219, 0.6)";
          ctx.beginPath();
          ctx.arc(fx, fy, 3 * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes with color based on phase alignment
      const refPhi = graph.nodes[0].phi0 + graph.nodes[0].omega * t;

      graph.nodes.forEach((n, idx) => {
        const x = cx + R * n.x,
          y = cy + R * n.y;
        const phi = n.phi0 + n.omega * t;

        // Make entangled nodes synchronized
        const isEntangledNode = graph.entangled.includes(idx);
        const syncedPhi = isEntangledNode ? refPhi : phi;

        // Phase alignment color (how aligned with reference node)
        const phaseDiff = Math.cos(syncedPhi - refPhi);
        const hue = phaseDiff > 0 ? 10 : 200; // Red = aligned, Blue = anti-aligned
        const sat = 70;
        const light = 85;

        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
        ctx.strokeStyle = isEntangledNode ? "#C0392B" : "#333";
        ctx.lineWidth = isEntangledNode ? 3 * devicePixelRatio : 1.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(x, y, 14 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Phasor
        const r = 10 * devicePixelRatio;
        const x2 = x + r * Math.cos(syncedPhi),
          y2 = y + r * Math.sin(syncedPhi);
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x2, y2, 2.5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
      });

      // Label entangled pair
      const ent1 = graph.nodes[graph.entangled[0]];
      const ent2 = graph.nodes[graph.entangled[1]];
      const ex1 = cx + R * ent1.x, ey1 = cy + R * ent1.y;
      const ex2 = cx + R * ent2.x, ey2 = cy + R * ent2.y;

      ctx.strokeStyle = "rgba(192, 57, 43, 0.4)";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 3 * devicePixelRatio]);
      ctx.beginPath();
      ctx.arc(ex1, ey1, 20 * devicePixelRatio, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ex2, ey2, 20 * devicePixelRatio, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Add measurement demo section
      const measureY = h * 0.75;
      const measurePeriod = 8; // seconds per cycle
      const cyclePhase = (t * speed * 0.5) % measurePeriod;
      const isMeasuring = cyclePhase > measurePeriod * 0.3 && cyclePhase < measurePeriod * 0.7;

      if (isMeasuring) {
        // Show measurement collapse
        ctx.fillStyle = "rgba(231, 76, 60, 0.2)";
        ctx.fillRect(ex1 - 30 * devicePixelRatio, ey1 - 30 * devicePixelRatio,
                     60 * devicePixelRatio, 60 * devicePixelRatio);

        ctx.fillStyle = "#c0392b";
        ctx.font = `bold ${11 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText("MEASURED!", ex1, ey1 - 40 * devicePixelRatio);

        // Show instant correlation at partner
        ctx.fillStyle = "rgba(231, 76, 60, 0.2)";
        ctx.fillRect(ex2 - 30 * devicePixelRatio, ey2 - 30 * devicePixelRatio,
                     60 * devicePixelRatio, 60 * devicePixelRatio);

        // Lightning bolt showing instant correlation
        ctx.strokeStyle = "#f39c12";
        ctx.lineWidth = 3 * devicePixelRatio;
        ctx.setLineDash([]);
        const midX = (ex1 + ex2) / 2;
        const midY = (ey1 + ey2) / 2;
        ctx.beginPath();
        ctx.moveTo(ex1, ey1);
        ctx.lineTo(midX - 10 * devicePixelRatio, midY);
        ctx.lineTo(midX + 10 * devicePixelRatio, midY);
        ctx.lineTo(ex2, ey2);
        ctx.stroke();
      }

      ctx.fillStyle = "#111";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Entangled nodes (red) rotate together. Measure one → partner instantly knows (no signal needed!)",
        w / 2,
        h - 20 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, graph, couple, speed]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
