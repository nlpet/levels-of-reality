import { useEffect, useRef } from "react";
import { useTicker } from "../utils/hooks";

export function SceneBlochSphere({ speed }) {
  const t = useTicker(speed);
  const canvasRef = useRef(null);
  useEffect(() => {
    const cvs = canvasRef.current,
      ctx = cvs.getContext("2d");
    let raf;
    const render = () => {
      const w = (cvs.width = cvs.clientWidth * devicePixelRatio),
        h = (cvs.height = cvs.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);

      // Main sphere on the left
      const cx1 = w * 0.35,
        cy1 = h * 0.5,
        R = Math.min(w, h) * 0.28;

      // Draw sphere
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 1.5 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(cx1, cy1, R, 0, Math.PI * 2);
      ctx.stroke();

      // Latitude circles
      for (let k = -3; k <= 3; k++) {
        const r = R * Math.cos((k * Math.PI) / 8);
        const y = cy1 + R * Math.sin((k * Math.PI) / 8) * 0.3;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(cx1, y, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Multiple state vectors rotating at different rates
      const states = [
        { omega: 0.6, theta: Math.PI / 4, color: "#E74C3C", label: "Fast" },
        { omega: 0.4, theta: Math.PI / 2.5, color: "#3498DB", label: "Med" },
        { omega: 0.25, theta: Math.PI / 3, color: "#2ECC71", label: "Slow" },
      ];

      states.forEach((state, idx) => {
        const phi = state.omega * t;
        const x3d = R * Math.sin(state.theta) * Math.cos(phi);
        const y3d = R * Math.cos(state.theta);
        const z3d = R * Math.sin(state.theta) * Math.sin(phi);

        // Project to 2D (pseudo-3D)
        const x2d = cx1 + x3d;
        const y2d = cy1 - y3d * 0.3 + z3d * 0.3;

        // State vector
        ctx.strokeStyle = state.color;
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(x2d, y2d);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = state.color;
        ctx.beginPath();
        ctx.arc(x2d, y2d, 4 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      // Basis states at poles
      ctx.fillStyle = "#666";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("|0⟩", cx1, cy1 - R - 15 * devicePixelRatio);
      ctx.fillText("|1⟩", cx1, cy1 + R + 25 * devicePixelRatio);

      // Phase projection on the right
      const cx2 = w * 0.75, cy2 = h * 0.5, r2 = R * 0.8;

      ctx.fillStyle = "#111";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Phase view", cx2, cy2 - r2 - 20 * devicePixelRatio);

      // Circle for phase
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 1.5 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2, 0, Math.PI * 2);
      ctx.stroke();

      // Project rotating vectors as phases
      states.forEach((state) => {
        const phi = state.omega * t;
        const px = cx2 + r2 * Math.cos(phi);
        const py = cy2 + r2 * Math.sin(phi);

        // Phasor
        ctx.strokeStyle = state.color;
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(cx2, cy2);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = state.color;
        ctx.beginPath();
        ctx.arc(px, py, 3 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connecting arrow
      ctx.fillStyle = "#666";
      ctx.font = `${16 * devicePixelRatio}px system-ui`;
      ctx.fillText("→", (cx1 + cx2) / 2, cy1);
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.fillText("projection", (cx1 + cx2) / 2, cy1 + 20 * devicePixelRatio);

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "3D rotation on sphere → 2D phase rotation. Different energies = different ω.",
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
