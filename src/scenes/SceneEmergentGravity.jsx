import { useEffect, useRef, useMemo } from "react";
import { useTicker } from "../utils/hooks";

export function SceneEmergentGravity({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);

  // Pre-compute qubit positions for boundary CFT and bulk
  const layout = useMemo(() => {
    const numBoundary = 24;
    const boundary = Array.from({ length: numBoundary }, (_, i) => {
      const angle = (i / numBoundary) * Math.PI * 2;
      return { angle, i };
    });
    return { boundary, numBoundary };
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
      ctx.fillText("EMERGENT SPACETIME: From Entanglement", w / 2, 28 * dpr);

      // === LEFT: AdS/CFT — boundary creates bulk ===
      const leftCx = w * 0.3;
      const leftCy = h * 0.45;
      const boundR = Math.min(w * 0.22, h * 0.3);

      ctx.fillStyle = "#8E44AD";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.fillText("AdS/CFT Correspondence", leftCx, h * 0.1);
      ctx.fillStyle = "#666";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("Boundary CFT (no gravity) ↔ Bulk (gravity)", leftCx, h * 0.1 + 16 * dpr);

      // Draw boundary circle (CFT lives here)
      ctx.strokeStyle = "rgba(142, 68, 173, 0.6)";
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath();
      ctx.arc(leftCx, leftCy, boundR, 0, Math.PI * 2);
      ctx.stroke();

      // Boundary qubits
      layout.boundary.forEach((q) => {
        const x = leftCx + boundR * Math.cos(q.angle);
        const y = leftCy + boundR * Math.sin(q.angle);
        const phase = Math.sin(t * 0.5 + q.i * 0.5) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(142, 68, 173, ${phase})`;
        ctx.beginPath();
        ctx.arc(x, y, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      // Entanglement threads from boundary INTO bulk (creating spacetime)
      // These form a tensor network / tree pattern
      const layers = 4;
      for (let layer = 0; layer < layers; layer++) {
        const layerR = boundR * (1 - (layer + 1) / (layers + 1));
        const nodesInLayer = Math.max(4, layout.numBoundary - layer * 6);

        for (let i = 0; i < nodesInLayer; i++) {
          const angle = (i / nodesInLayer) * Math.PI * 2 + layer * 0.2;
          const x = leftCx + layerR * Math.cos(angle);
          const y = leftCy + layerR * Math.sin(angle);

          // Connect to nearby boundary or previous layer nodes
          const outerR = boundR * (1 - layer / (layers + 1));
          const angle1 = angle - 0.15;
          const angle2 = angle + 0.15;
          const ox1 = leftCx + outerR * Math.cos(angle1);
          const oy1 = leftCy + outerR * Math.sin(angle1);
          const ox2 = leftCx + outerR * Math.cos(angle2);
          const oy2 = leftCy + outerR * Math.sin(angle2);

          const alpha = 0.15 + 0.1 * Math.sin(t * 0.4 + i + layer);
          ctx.strokeStyle = `rgba(155, 89, 182, ${alpha})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(ox1, oy1);
          ctx.lineTo(x, y);
          ctx.lineTo(ox2, oy2);
          ctx.stroke();

          // Node
          ctx.fillStyle = `rgba(155, 89, 182, ${0.3 + layer * 0.1})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Center label
      ctx.fillStyle = "#8E44AD";
      ctx.font = `bold ${11 * dpr}px system-ui`;
      ctx.fillText("Bulk", leftCx, leftCy - 5 * dpr);
      ctx.fillStyle = "#666";
      ctx.font = `${9 * dpr}px system-ui`;
      ctx.fillText("(spacetime", leftCx, leftCy + 8 * dpr);
      ctx.fillText("emerges here)", leftCx, leftCy + 19 * dpr);

      // Boundary label
      ctx.fillStyle = "#8E44AD";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("Boundary (quantum theory, no gravity)", leftCx, leftCy + boundR + 20 * dpr);

      // === RIGHT: ER = EPR visualization ===
      const rightCx = w * 0.72;
      const rightCy = h * 0.42;

      ctx.fillStyle = "#E74C3C";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.fillText("ER = EPR", rightCx, h * 0.1);
      ctx.fillStyle = "#666";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("Wormhole ≡ Entanglement", rightCx, h * 0.1 + 16 * dpr);

      // Two black holes
      const bhSep = 90 * dpr;
      const bhR = 25 * dpr;
      const bh1x = rightCx - bhSep;
      const bh2x = rightCx + bhSep;

      // Wormhole tunnel between them (pulsing)
      const tunnelWidth = 18 * dpr + 5 * dpr * Math.sin(t * 0.8);
      ctx.fillStyle = "rgba(231, 76, 60, 0.08)";
      ctx.beginPath();
      ctx.moveTo(bh1x + bhR * 0.5, rightCy - tunnelWidth);
      ctx.quadraticCurveTo(rightCx, rightCy - tunnelWidth * 0.6, bh2x - bhR * 0.5, rightCy - tunnelWidth);
      ctx.lineTo(bh2x - bhR * 0.5, rightCy + tunnelWidth);
      ctx.quadraticCurveTo(rightCx, rightCy + tunnelWidth * 0.6, bh1x + bhR * 0.5, rightCy + tunnelWidth);
      ctx.closePath();
      ctx.fill();

      // Tunnel walls
      ctx.strokeStyle = "rgba(231, 76, 60, 0.4)";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(bh1x + bhR * 0.5, rightCy - tunnelWidth);
      ctx.quadraticCurveTo(rightCx, rightCy - tunnelWidth * 0.6, bh2x - bhR * 0.5, rightCy - tunnelWidth);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bh1x + bhR * 0.5, rightCy + tunnelWidth);
      ctx.quadraticCurveTo(rightCx, rightCy + tunnelWidth * 0.6, bh2x - bhR * 0.5, rightCy + tunnelWidth);
      ctx.stroke();

      // Entanglement waves traveling through tunnel
      for (let i = 0; i < 5; i++) {
        const progress = ((t * 0.5 + i * 0.2) % 1);
        const px = bh1x + (bh2x - bh1x) * progress;
        const py = rightCy + Math.sin(progress * Math.PI) * tunnelWidth * -0.2;
        ctx.fillStyle = `rgba(231, 76, 60, ${0.6 - progress * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, 3 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Black holes
      [bh1x, bh2x].forEach((bhx) => {
        // Event horizon
        const grad = ctx.createRadialGradient(bhx, rightCy, 0, bhx, rightCy, bhR);
        grad.addColorStop(0, "#111");
        grad.addColorStop(0.7, "#2c3e50");
        grad.addColorStop(1, "rgba(44, 62, 80, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bhx, rightCy, bhR, 0, Math.PI * 2);
        ctx.fill();

        // Accretion glow
        ctx.strokeStyle = "rgba(241, 196, 15, 0.3)";
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(bhx, rightCy, bhR + 4 * dpr, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Labels
      ctx.fillStyle = "#F39C12";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("Black Hole A", bh1x, rightCy + bhR + 18 * dpr);
      ctx.fillText("Black Hole B", bh2x, rightCy + bhR + 18 * dpr);

      // Ryu-Takayanagi formula
      const rtY = h * 0.7;
      ctx.fillStyle = "#111";
      ctx.font = `bold ${12 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Ryu-Takayanagi Formula", rightCx, rtY);

      ctx.fillStyle = "#8E44AD";
      ctx.font = `${13 * dpr}px system-ui`;
      ctx.fillText("S_A = Area(γ_A) / 4G_N", rightCx, rtY + 20 * dpr);

      ctx.fillStyle = "#666";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText("Entanglement entropy = minimal surface area", rightCx, rtY + 38 * dpr);
      ctx.fillText("Proven within AdS/CFT", rightCx, rtY + 52 * dpr);

      // Bottom
      ctx.fillStyle = "#111";
      ctx.font = `${11 * dpr}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Strongest evidence: spacetime geometry is encoded in quantum entanglement structure.",
        w / 2, h - 30 * dpr
      );
      ctx.fillStyle = "#999";
      ctx.font = `${10 * dpr}px system-ui`;
      ctx.fillText(
        "Caveat: proven in Anti-de Sitter space, not our (de Sitter) universe. Still speculative for cosmology.",
        w / 2, h - 12 * dpr
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, layout]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}
