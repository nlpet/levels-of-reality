import React from "react";
import { LEVELS } from "../data/levels";

function Range({ label, min, max, step, value, onChange }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export function Sidebar({ active, setActive, params, setParams }) {
  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-3 overflow-y-auto max-h-[calc(80vh-2rem)]">
      <div className="space-y-3">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setActive(lvl.id)}
            className={`w-full text-left rounded-2xl p-4 shadow-sm border transition ${
              active === lvl.id
                ? "bg-black text-white border-black"
                : "bg-white border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="text-sm opacity-70">{lvl.subtitle}</div>
            <div className="font-semibold">{lvl.title}</div>
            <div className="text-sm opacity-80 mt-1">{lvl.desc}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <div className="font-semibold">Controls</div>
        <Range
          label="Speed (global)"
          min={0.1}
          max={3}
          step={0.1}
          value={params.speed}
          onChange={(v) => setParams((p) => ({ ...p, speed: v }))}
        />
        <Range
          label="ω (phasor)"
          min={0.05}
          max={2}
          step={0.05}
          value={params.omega}
          onChange={(v) => setParams((p) => ({ ...p, omega: v }))}
        />
        <Range
          label="Coupling strength"
          min={0}
          max={1}
          step={0.05}
          value={params.couple}
          onChange={(v) => setParams((p) => ({ ...p, couple: v }))}
        />
      </div>
    </div>
  );
}
