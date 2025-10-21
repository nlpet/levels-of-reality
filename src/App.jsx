import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { LEVELS } from "./data/levels";
import { Sidebar } from "./components/Sidebar";
import { Card } from "./components/Card";
import { Companion } from "./components/Companion";
import {
  ScenePhasor,
  SceneWave1D,
  ScenePathIntegral,
  SceneBlochSphere,
  SceneNetwork,
  SceneField2D,
  SceneMystery,
  SceneDecoherence,
  SceneClassical,
  SceneArrowOfTime,
  SceneQFT,
  SceneStandardModel,
  SceneSymmetry,
  SceneBornRule,
  SceneSpacetime,
  SceneQuantumGravity,
  SceneStringTheory,
  SceneLoopQG,
  SceneEmergentGravity,
} from "./scenes";

export default function QuantumTimeVisualizerV3() {
  const [active, setActive] = useState(0);
  const [params, setParams] = useState({ speed: 1.0, omega: 0.2, couple: 0.7 });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          What IS Time? A Journey to the Quantum Foundation
        </h1>
        <p className="text-gray-700 max-w-full mt-1">
          We take time for granted—but what generates it? Start with the everyday mystery of ticking clocks,
          then journey through sixteen levels of reality—from classical emergence to quantum foundations, through the Standard Model and symmetries, to competing theories of quantum gravity, and back—to discover the irreducible core: <strong>quantum phase rotation</strong>.
          The journey is circular: macroscopic time emerges from microscopic clocks, which explain macroscopic time.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[80vh] w-full">
        <Sidebar
          active={active}
          setActive={setActive}
          params={params}
          setParams={setParams}
        />

        <Card
          title={LEVELS.find((l) => l.id === active)?.title}
          caption={LEVELS.find((l) => l.id === active)?.desc}
          activeId={active}
        >
          {active === 0 && <SceneMystery speed={params.speed} />}
          {active === 1 && <SceneDecoherence speed={params.speed} />}
          {active === 2 && <SceneArrowOfTime speed={params.speed} />}
          {active === 3 && <SceneQFT speed={params.speed} />}
          {active === 4 && <SceneStandardModel speed={params.speed} />}
          {active === 5 && <SceneNetwork speed={params.speed} couple={params.couple} />}
          {active === 6 && <SceneSymmetry speed={params.speed} />}
          {active === 7 && <SceneBlochSphere speed={params.speed} />}
          {active === 8 && <SceneBornRule speed={params.speed} />}
          {active === 9 && <ScenePathIntegral speed={params.speed} />}
          {active === 10 && <ScenePhasor omega={params.omega} speed={params.speed} />}
          {active === 11 && <SceneSpacetime speed={params.speed} />}
          {active === 12 && <SceneQuantumGravity speed={params.speed} />}
          {active === 13 && <SceneStringTheory speed={params.speed} />}
          {active === 14 && <SceneLoopQG speed={params.speed} />}
          {active === 15 && <SceneEmergentGravity speed={params.speed} />}
        </Card>

        <Companion active={active} />
      </div>

      <div className="mt-4 mb-8 rounded-2xl border shadow-sm bg-blue-50 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-sm">
            <strong>Navigation:</strong> Click levels in sidebar, or use ↑/↓ arrow keys
          </div>
          <div className="text-sm text-gray-700">
            Journey: Classical → Quantum → Relativity → Quantum Gravity → ↻
          </div>
        </div>
      </div>
    </div>
  );
}
