import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// ==========================
// Quantum Time Visualizer + Companion (v3)
// ==========================
// Fixes React error #31 by avoiding rendering an object as a child.
// We now pass the active level id into <Card /> and read INFO[activeId].math/link explicitly.
// ==========================

const LEVELS = [
  {
    id: 0,
    title: "0. The Mystery: Classical Time",
    subtitle: "Where does time come from?",
    desc: "We experience time as objective flow: clocks tick, planets orbit. But what mechanism produces this?",
  },
  {
    id: 1,
    title: "1. Decoherence Creates Classicality",
    subtitle: "How quantum becomes classical",
    desc: "Environment entangles with system, erasing phase coherence. Classical trajectories emerge from quantum substrate.",
  },
  {
    id: 2,
    title: "2. The Arrow of Time",
    subtitle: "Why does time flow forward?",
    desc: "Microscopic laws are reversible, yet we experience irreversibility. Entropy, memory, causality—all point one direction.",
  },
  {
    id: 3,
    title: "3. Quantum Fields (QFT)",
    subtitle: "Particles as field excitations",
    desc: "Not wavefunctions—quantum fields. Electron field, photon field. Particles = quantized ripples. Second quantization.",
  },
  {
    id: 4,
    title: "4. Coupled Subsystems & Entanglement",
    subtitle: "How systems interact",
    desc: "Amplitude flows between coupled nodes. Off-diagonal Hamiltonian terms create correlations—entanglement.",
  },
  {
    id: 5,
    title: "5. Hilbert Space Unitary Evolution",
    subtitle: "The fundamental dynamics",
    desc: "State vectors rotate on hypersphere. Evolution operator e^{-iHt/ħ} preserves probability.",
  },
  {
    id: 6,
    title: "6. Measurement & the Born Rule",
    subtitle: "Why |ψ|² = probability?",
    desc: "Decoherence explains no superpositions, but not why outcomes are probabilistic or why this specific rule.",
  },
  {
    id: 7,
    title: "7. Path Integral: Summing Histories",
    subtitle: "All possible trajectories",
    desc: "Each path contributes e^{iS/ħ}. Nearby paths with similar action interfere constructively—classical path emerges.",
  },
  {
    id: 8,
    title: "8. The Foundation: Phase Rotation",
    subtitle: "The atomic clock",
    desc: "Every quantum state has internal phase ψ = Ae^{-iEt/ħ} rotating at ω = E/ħ. This IS time.",
  },
  {
    id: 9,
    title: "9. Spacetime & Relativity",
    subtitle: "Space and time are unified",
    desc: "Proper time along worldline = accumulated phase. Spacetime is the arena. Where does spatial structure come from?",
  },
  {
    id: 10,
    title: "10. The Frontier: Quantum Gravity",
    subtitle: "The unfinished story",
    desc: "Gravity remains classical. Is spacetime emergent from entanglement? The deepest question physics hasn't answered.",
  },
  {
    id: 11,
    title: "11. String Theory: Vibrating Geometry",
    subtitle: "Strings in 10D spacetime",
    desc: "Replace point particles with 1D strings. Vibration modes = particles. Gravity emerges from closed-string modes.",
  },
  {
    id: 12,
    title: "12. Loop Quantum Gravity: Discrete Space",
    subtitle: "Spacetime atoms",
    desc: "Quantize spacetime itself. Space is woven from loops—discrete quantum geometry. No background, no extra dimensions.",
  },
  {
    id: 13,
    title: "13. Emergent Gravity: From Entanglement",
    subtitle: "Spacetime is not fundamental",
    desc: "ER=EPR: wormholes ≈ entanglement. Spacetime geometry emerges from quantum information. The most radical idea.",
  },
];

const INFO = {
  0: { math: "Observable: clocks tick, orbits evolve, $\\Delta t$ is measurable", link: "↓ To understand this, we must dig beneath appearances..." },
  1: { math: "Decoherence: $\\rho \\to \\text{diag}(\\rho)$ suppresses off-diagonal terms", link: "↓ But why does time flow FORWARD? Unitary evolution is reversible..." },
  2: { math: "$S = k_B \\ln \\Omega$ — entropy increases, defines arrow", link: "↓ Now what IS the quantum substrate that decoheres?" },
  3: { math: "QFT: $\\hat{\\phi}(x,t)$ — fields, not particles. $a^\\dagger|0\\rangle$ creates excitations", link: "↓ How do field modes couple? What is entanglement, mechanically?" },
  4: { math: "$i\\hbar \\dot{c}_i = \\sum_j H_{ij} c_j$ — amplitude flows via couplings", link: "↓ This is already Hilbert-space dynamics. What does that mean?" },
  5: { math: "$|\\psi(t)\\rangle = e^{-iHt/\\hbar}|\\psi(0)\\rangle$ — unitary rotation", link: "↓ But measurement gives definite outcomes. Why |ψ|²?" },
  6: { math: "Born rule: $P(outcome) = |\\langle outcome | \\psi \\rangle|^2$", link: "↓ Postulate or derivable? Still debated. Now—where does unitary come from?" },
  7: { math: "$\\Psi(B) = \\sum_{\\text{paths}} e^{iS[\\text{path}]/\\hbar}$ — path integral", link: "↓ All paths share one feature: phase accumulation..." },
  8: { math: "$\\psi(t) = A e^{-iEt/\\hbar}$, where $\\omega = E/\\hbar$", link: "↓ This is time. But time and SPACE are unified—what about relativity?" },
  9: { math: "Proper time: $d\\tau^2 = dt^2 - dx^2/c^2$. Phase $\\propto \\int mc^2 d\\tau$", link: "↓ Spacetime is the arena. But what about spacetime ITSELF?" },
  10: { math: "Quantum gravity: $G_{\\mu\\nu} = 8\\pi G T_{\\mu\\nu}$ ← classical! No quantum version yet.", link: "↓ Three paths forward: strings, loops, or emergence..." },
  11: { math: "String: $X^\\mu(\\sigma, \\tau)$ — string worldsheet. Closed strings ⊃ graviton mode $h_{\\mu\\nu}$", link: "→ Next: Loop Quantum Gravity—discrete spacetime atoms..." },
  12: { math: "LQG: $\\hat{A}_i^a, \\hat{E}_a^i$ — area & volume are quantized. Spin networks.", link: "→ Next: Emergent spacetime from entanglement..." },
  13: { math: "ER=EPR: entangled qubits ≈ wormhole. $S_{entanglement} \\sim$ area. Spacetime = illusion.", link: "↻ Full circle: macroscopic time emerges from microscopic phase. ↻ Level 0" },
};

const DEEP = {
  0: {
    problem: `We take time for granted. Clocks tick. The universe ages. Causality flows forward. But **what generates the experience of time**? Why isn't the universe frozen?`,
    idea: `This is the **puzzle** we'll solve by descending through layers of reality.

The macroscopic world has:
- Definite outcomes (not superpositions)
- Measurable time intervals
- Causal structure (before/after)

None of these are fundamental. They *emerge*. Let's dig down to find what they emerge *from*.`,
    why: `Starting here inverts the usual pedagogy. Instead of building up from abstraction, we start with **the mystery you actually experience** and explain it. This makes the journey feel like detective work, not just math.`,
    bridge: `The classical world is an **illusion created by decoherence**. To understand time, we must first understand how quantum reality masquerades as classical. ↓ Level 1`
  },
  1: {
    problem: `The everyday world has no superpositions. Schrödinger's cat is never seen half-alive. Why does **measurement** seem to collapse the wavefunction into one definite outcome?`,
    idea: `**Decoherence** is the answer. When a quantum system interacts with a large environment (air molecules, photons, thermal bath), they become entangled:
$$
|\\psi\\rangle_{\\text{system}} \\otimes |E_0\\rangle_{\\text{env}} \\to \\sum_i c_i |i\\rangle_{\\text{system}} \\otimes |E_i\\rangle_{\\text{env}}
$$
The environment "measures" the system continuously. Off-diagonal density matrix terms $\\langle i | \\rho | j \\rangle$ decay exponentially fast (~$10^{-23}$ sec for a dust grain). What remains looks classical.`,
    why: `Decoherence solves the measurement problem *observationally* (not ontologically). It explains why we never see macroscopic superpositions: **phase information leaks into too many degrees of freedom to track**. Classical time emerges from stable "pointer states."`,
    bridge: `But this raises a puzzle: if microscopic quantum laws are **time-reversible**, why does the macro world have an arrow? ↓ Level 2`
  },
  2: {
    problem: `Fundamental physics is time-symmetric. Schrödinger's equation works equally well forward or backward. Yet we **remember** the past, not the future. Eggs break but don't unbreak. Why?`,
    idea: `The answer is **entropy**. The second law of thermodynamics:
$$
\\Delta S \\geq 0
$$
Entropy ($S = k_B \\ln \\Omega$, the log of accessible microstates) increases. A broken egg has vastly more possible arrangements than an intact one. The arrow of time is statistical: we started in a **low-entropy state** (Big Bang) and have been relaxing ever since.`,
    why: `This explains irreversibility without contradicting reversible fundamental laws. **Memory** requires entropy increase (writing to a brain increases entropy). **Causality** is directional because we can manipulate the past via records, but not the future. The thermodynamic arrow *is* the psychological arrow.`,
    bridge: `Decoherence itself is an entropy-increasing process. Now: what **is** the quantum substrate that decoheres and thermalizes? ↓ Level 3`
  },
  3: {
    problem: `We've been talking about "wavefunctions" and "particles," but reality is deeper. What **are** particles? Why do field excitations come in discrete packets?`,
    idea: `**Quantum Field Theory (QFT)**: The universe is filled with **fields**—one for each particle type. The electron field $\\hat{\\psi}_e(x)$, photon field $\\hat{A}_\\mu(x)$, etc. A "particle" is an **excitation**: $a^\\dagger|0\\rangle$ creates a ripple in the field. Multiple excitations = multiple particles. This is **second quantization**: fields are operators, not wavefunctions.`,
    why: `QFT unifies special relativity and quantum mechanics. It explains particle creation/annihilation (Feynman diagrams), the Pauli exclusion principle (fermion fields anticommute), and the Casimir effect (vacuum energy). Particles aren't fundamental—**fields** are.`,
    bridge: `Fields have modes—Fourier components. How do these modes couple? What is entanglement at the field level? ↓ Level 4`
  },
  4: {
    problem: `Systems don't evolve in isolation. Atoms couple to photons; spins couple to neighbors. How does quantum information **flow between subsystems**? What is entanglement, mechanically?`,
    idea: `Write the state as $|\\psi\\rangle = \\sum_i c_i |i\\rangle$ in some basis. Evolution becomes:
$$
i\\hbar \\dot{c}_i = \\sum_j H_{ij} c_j
$$
Each $c_i$ is a complex amplitude (a rotating phasor). The off-diagonal terms $H_{ij}$ ($i \\neq j$) are **couplings**: they let amplitude leak from node $j$ to node $i$. Entanglement is just correlated phase across nodes.`,
    why: `This reveals quantum mechanics as a **network of phase rotations** with amplitude flowing along edges. Time evolution is the synchronized dance of all these phasors. Entanglement isn't spooky—it's phase correlation enforced by coupling terms.`,
    bridge: `But this is already assuming Hilbert space and unitary evolution. **Why** does nature use this mathematical structure? ↓ Level 5`
  },
  5: {
    problem: `Why does quantum mechanics use complex numbers? Why unitary evolution? Why does the time-evolution operator have the form $e^{-iHt/\\hbar}$?`,
    idea: `The state of a system is a vector $|\\psi\\rangle$ in Hilbert space. Time evolution is a **rotation** that preserves the norm (probability):
$$
|\\psi(t)\\rangle = e^{-iHt/\\hbar} |\\psi(0)\\rangle
$$
This is **unitary**: $U^\\dagger U = I$. The generator $H$ (Hamiltonian) determines the axis and rate of rotation. Energy eigenvalues are rotation frequencies.`,
    why: `Hilbert space is the natural geometry for **probability amplitudes**. Unitary evolution is the only way to evolve probabilities while preserving total probability. The mystery of quantum mechanics is: **why are probabilities computed from interfering amplitudes instead of added directly?**`,
    bridge: `But measurement *doesn't* give amplitudes—it gives definite outcomes with probabilities. Where does that come from? ↓ Level 6`
  },
  6: {
    problem: `Decoherence explains why we don't see superpositions. But it doesn't explain **why measurement outcomes are probabilistic** or why specifically $P = |\\psi|^2$. Where does the Born rule come from?`,
    idea: `The **Born rule** is:
$$
P(\\text{outcome } i) = |\\langle i | \\psi \\rangle|^2
$$
This is usually taken as a **postulate**. Some attempts to derive it:
- Decision-theoretic (Deutsch, Wallace): rational agents betting under uncertainty *must* use $|\\psi|^2$ to be consistent.
- Envariance (Zurek): entanglement + symmetry → Born rule.
- Many-worlds: branch weights.

**No consensus.** It remains one of QM's deepest mysteries.`,
    why: `This is an **open question**. We know *how* to use the Born rule, but not *why* it's true. Some think it's derivable from deeper principles; others think it's an axiom. This honest gap separates working physics from philosophical foundations.`,
    bridge: `Accepting Born rule for now: where does unitary evolution itself come from? ↓ Level 7`
  },
  7: {
    problem: `The Schrödinger equation gives the wavefunction's evolution, but **where does that equation come from**? Is there a deeper principle?`,
    idea: `**Feynman's path integral**: The amplitude to go from $A$ to $B$ is a sum over *every possible path* connecting them:
$$
\\Psi(B) = \\sum_{\\text{all paths } A \\to B} e^{iS[\\text{path}]/\\hbar}
$$
where $S$ is the **classical action** $\\int L \\, dt$. Paths near the stationary-action path (the classical trajectory) have similar phases → they interfere constructively. Wild paths cancel out.`,
    why: `This explains **why classical mechanics works**: it's the stationary-phase approximation of quantum mechanics. The principle of least action isn't fundamental—it's an **interference effect**. And it reveals what's truly fundamental: **phase accumulation**.`,
    bridge: `Every path contributes a phase $e^{iS/\\hbar}$. The action $S = \\int E \\, dt - \\int p \\, dx$ has a time part: $E \\cdot t$. This is where time comes from. ↓ Level 8`
  },
  8: {
    problem: `We've peeled away every layer. What is the **irreducible core**—the atomic mechanism that generates time itself?`,
    idea: `Every quantum state has an internal phase that rotates:
$$
\\psi(t) = A e^{-iEt/\\hbar}
$$
The phase advances at angular frequency $\\omega = E/\\hbar$. This is the **fundamental clock**.

An electron at rest ($E = mc^2$) has a Compton frequency of ~$10^{20}$ Hz. **This phase rotation IS time.** There is no deeper mechanism. Time is the rate at which quantum phase accumulates.`,
    why: `This is the bottom (for time). Energy and frequency are the same thing ($E = \\hbar \\omega$). Every particle is a clock. Every interaction synchronizes clocks. Relativity's "proper time" is literally the phase accumulated along a worldline. **Time is not a backdrop—it's the phase of the wavefunction.**`,
    bridge: `But we've talked about time without mentioning **space**. Einstein unified them. What about spacetime? ↓ Level 9`
  },
  9: {
    problem: `So far we've treated space as a backdrop—a stage where fields live. But **relativity says spacetime is dynamical**. Where does spatial structure come from? Why is spacetime 3+1 dimensional?`,
    idea: `In relativity, **spacetime is unified**. Proper time along a worldline:
$$
d\\tau = \\sqrt{dt^2 - dx^2/c^2}
$$
connects time and space. The phase accumulated is:
$$
\\phi \\propto \\int mc^2 \\, d\\tau = \\int (E \\, dt - p \\cdot dx)
$$
Space and time are both encoded in phase. But where does the **metric** $g_{\\mu\\nu}$ itself come from?`,
    why: `This connects quantum phase to relativistic geometry. But it also exposes a gap: we've explained time (phase rotation), but **not space**. Why 3 dimensions? Why locality? Possible hints: holography (AdS/CFT), ER=EPR (entanglement = wormholes). Space might emerge from entanglement structure.`,
    bridge: `Spacetime in GR is classical. But quantum fields live on it. What about quantum **spacetime itself**? ↓ Level 10`
  },
  10: {
    problem: `We've explained quantum mechanics (fields, phase, measurement). We've explained classical time and space. But **gravity** is still classical. How do you quantize spacetime itself?`,
    idea: `**The problem**: Einstein's field equations are:
$$
G_{\\mu\\nu} = 8\\pi G T_{\\mu\\nu}
$$
LEFT side = spacetime geometry (classical). RIGHT side = matter (quantum). This mismatch is unsolved.

Attempts:
- **String theory**: 1D strings vibrating in 10D spacetime.
- **Loop quantum gravity**: spacetime made of discrete loops.
- **Emergent gravity** (Verlinde): gravity = entropy gradient.

**No experimental evidence for any approach yet.**`,
    why: `This is the **frontier**. We don't know if spacetime is fundamental or emergent. Hints: black hole thermodynamics (Bekenstein-Hawking), holography (entropy ~ area, not volume). Maybe spacetime emerges from entanglement, and the Big Bang was a quantum phase transition.`,
    bridge: `Three main approaches compete. Let's explore each in depth. → Level 11`
  },
  11: {
    problem: `If we want to quantize gravity, we need to reconcile it with quantum mechanics. String theory asks: **what if particles aren't points but strings?**`,
    idea: `Replace point particles with **1-dimensional strings** (length ~ Planck scale $10^{-35}$ m).

**Key insights:**

1. **Vibration modes = particles**: Different string vibrations look like different particles (electron, quark, photon).

2. **Closed strings contain graviton**: One vibration mode of a closed string has spin-2—this IS the graviton (the force carrier of gravity). **Gravity emerges automatically** from string theory.

3. **Extra dimensions**: Consistency requires **10 spacetime dimensions** (9 space + 1 time). The 6 extra dimensions are "compactified" (curled up at tiny scales).

4. **Worldsheet dynamics**: Instead of a worldline $x^\\mu(\\tau)$, strings trace a 2D worldsheet:
$$
X^\\mu(\\sigma, \\tau)
$$
where $\\sigma$ parametrizes position along the string, $\\tau$ is proper time.

5. **No infinities**: Point particles cause divergences (infinite self-energy). Strings are extended—smoothing interactions resolves infinities.`,
    why: `String theory **was once the leading candidate** for quantum gravity and dominated theoretical physics for decades. It's mathematically elegant and predicts gravitons naturally. **But major problems remain**: (1) **No experimental evidence** after 40+ years—no supersymmetry, no extra dimensions detected. (2) **The landscape problem**: $10^{500}$ possible vacuum states with no principle to select ours—some argue this makes it unfalsifiable. (3) **Requires background spacetime**, contradicting general relativity's insight that geometry is dynamic. Many physicists now consider it unlikely to be the correct theory of nature, though the mathematical tools have proven useful elsewhere (AdS/CFT).`,
    bridge: `String theory adds dimensions. Loop Quantum Gravity takes the opposite approach: keep 4D spacetime but **quantize geometry itself**. → Level 12`
  },
  12: {
    problem: `String theory assumes spacetime exists as background. Loop Quantum Gravity asks: **what if spacetime itself is made of quantum building blocks?**`,
    idea: `Quantize **geometry directly** using Einstein's equations as the starting point.

**Key insights:**

1. **No background**: Unlike string theory, LQG doesn't assume a fixed spacetime. Spacetime geometry is the dynamical quantum variable.

2. **Spin networks**: Space is woven from **loops** (1D edges). Each edge carries a "spin" label (like angular momentum quantization). The network defines spatial geometry.

3. **Area and volume are quantized**:
$$
\\hat{A} = 8\\pi \\gamma \\ell_P^2 \\sum_i \\sqrt{j_i(j_i+1)}
$$
Area operator has discrete spectrum—smallest area ~ $\\ell_P^2$ (Planck area). Volume is also discrete.

4. **Spin foams**: Evolution = transition between spin networks. A "spin foam" is the 4D history (like Feynman diagrams for spacetime).

5. **No singularities**: Black hole singularities and Big Bang are replaced by quantum geometry transitions. Space can "bounce."`,
    why: `LQG is **background-independent** and preserves general relativity's core insight: gravity = geometry. No extra dimensions, no supersymmetry. But: hard to extract classical GR in the limit. No clear way to incorporate matter (the Standard Model). And it's difficult to make testable predictions.`,
    bridge: `LQG quantizes spacetime but keeps it fundamental. The most radical idea: **spacetime isn't fundamental at all**—it emerges from entanglement. → Level 13`
  },
  13: {
    problem: `What if spacetime is an **illusion**—a macroscopic phenomenon that emerges from something deeper? What if that "something" is quantum entanglement?`,
    idea: `**ER=EPR conjecture** (Maldacena & Susskind):

Einstein-Rosen bridges (wormholes) $\\equiv$ Einstein-Podolsky-Rosen pairs (entanglement).

**Key insights:**

1. **Entanglement creates geometry**: Two entangled qubits are connected by a "quantum thread." Many entangled qubits weave a spatial fabric. **Distance = inverse entanglement strength**.

2. **Holographic principle**: All information in a volume is encoded on its boundary (like a hologram). Entropy is proportional to **surface area**, not volume:
$$
S_{BH} = \\frac{A}{4 \\ell_P^2}
$$
This suggests spacetime is 2D information projected into 3D experience.

3. **AdS/CFT correspondence**: Gravity in $(d+1)$-dimensional Anti-de Sitter space is **exactly dual** to a $d$-dimensional quantum field theory (no gravity) on the boundary. Spacetime emerges from entanglement in the boundary CFT. This is **mathematically rigorous** (proven in certain cases) and the strongest evidence for emergent spacetime.

4. **Verlinde's entropic gravity** (2010): Proposed gravity as an **entropic force**—like a stretched polymer. **Status: likely incorrect**. His 2016 extension tried to explain dark matter but made predictions contradicting observations (galaxy rotation curves, lensing). Most physicists consider this approach a dead end, though the intuition about thermodynamics and gravity remains interesting.

5. **Tensor networks**: Models like MERA (Multi-scale Entanglement Renormalization Ansatz) show how spatial geometry can emerge from entanglement structure in Hilbert space. This is an **active research area** with rigorous results connecting entanglement entropy to geometry.`,
    why: `This is the **most radical** proposal, but with varying levels of support. **Strong evidence**: AdS/CFT is proven in special cases and shows spacetime can emerge from quantum entanglement. Black hole entropy ~ area suggests deep connection. **Active research**: Tensor networks, quantum error correction ↔ geometry. **Failed approaches**: Verlinde's entropic gravity hasn't held up empirically. **The big picture**: We have hints that spacetime emerges from entanglement, but no complete theory for our universe (AdS/CFT works in Anti-de Sitter space, not our de Sitter universe). Still highly speculative but the most conceptually promising direction.`,
    bridge: `↻ **Full circle**: We started asking "What is time?" We descended through quantum phase rotation, fields, entanglement, spacetime. Now we've seen that spacetime itself may emerge from entanglement. Time is phase; space is entanglement; reality is woven from quantum information. ↻ Back to Level 0 with deeper eyes.`
  }
};

function useTicker(speed = 1) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0,
      last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => v + dt * speed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);
  return t;
}

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

function Sidebar({ active, setActive, params, setParams }) {
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

function Card({ title, children, caption, activeId }) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-6 h-full overflow-hidden">
      <div className="h-full rounded-2xl p-4 border shadow-sm bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{title}</div>
        </div>
        <div className="flex-1 overflow-hidden rounded-xl border bg-gray-50 flex items-center justify-center">
          {children}
        </div>
        {caption && <div className="text-xs text-gray-600 mt-2">{caption}</div>}
        <div className="text-xs text-gray-600 mt-2">
          <MD>{`**Math:** ${INFO[activeId]?.math}  ${INFO[activeId]?.link}`}</MD>
        </div>
      </div>
    </div>
  );
}

function Companion({ active }) {
  const d = DEEP[active];
  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-3 h-full overflow-hidden">
      <div className="h-full rounded-2xl p-4 border shadow-sm bg-white flex flex-col overflow-hidden">
        <div className="text-lg font-semibold mb-1">
          Companion: Why this level exists
        </div>
        <div className="text-xs text-gray-600 mb-3">
          Synced to the active level. Scroll to read the deep dive.
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <Section label="Problem" text={d.problem} />
          <Section label="Idea" text={d.idea} />
          <Section label="Why we need it" text={d.why} />
          <Section label="Bridge" text={d.bridge} />
        </div>
      </div>
    </div>
  );
}

function MD({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({node, ...props}) => <p className="mb-2" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
        code: ({inline, children, ...props}) => (
          <code className={`px-1 py-0.5 rounded ${inline ? "bg-gray-100" : "bg-gray-50 block p-2"}`} {...props}>
            {children}
          </code>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

function Section({ label, text }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-sm text-gray-800 leading-relaxed">
        <MD>{text}</MD>
      </div>
    </div>
  );
}

// ------------- Scenes -------------
function ScenePhasor({ omega, speed }) {
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

      // Three phasors representing different energy states
      const phasors = [
        { label: "Low E", omega: 0.3, color: "#2ECC71", cx: w * 0.25, cy: h * 0.35 },
        { label: "Med E", omega: 0.6, color: "#3498DB", cx: w * 0.5, cy: h * 0.35 },
        { label: "High E", omega: 1.0, color: "#E74C3C", cx: w * 0.75, cy: h * 0.35 },
      ];

      const r = Math.min(w, h) * 0.15;

      phasors.forEach((phasor) => {
        // Circle
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(phasor.cx, phasor.cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating phasor
        const phi = 2 * Math.PI * phasor.omega * t;
        const x = phasor.cx + r * Math.cos(phi);
        const y = phasor.cy + r * Math.sin(phi);

        ctx.strokeStyle = phasor.color;
        ctx.lineWidth = 3 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(phasor.cx, phasor.cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = phasor.color;
        ctx.beginPath();
        ctx.arc(x, y, 5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#111";
        ctx.font = `${12 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(phasor.label, phasor.cx, phasor.cy - r - 15 * devicePixelRatio);
        ctx.fillText(`ω = E/ℏ`, phasor.cx, phasor.cy + r + 25 * devicePixelRatio);
      });

      // Clock metaphor at bottom
      const clockCx = w * 0.5, clockCy = h * 0.75, clockR = Math.min(w, h) * 0.12;

      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Every quantum state IS a clock", clockCx, clockCy - clockR - 20 * devicePixelRatio);

      // Clock face
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(clockCx, clockCy, clockR, 0, Math.PI * 2);
      ctx.stroke();

      // Tick marks
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = clockCx + clockR * 0.85 * Math.cos(angle);
        const y1 = clockCy + clockR * 0.85 * Math.sin(angle);
        const x2 = clockCx + clockR * 0.95 * Math.cos(angle);
        const y2 = clockCy + clockR * 0.95 * Math.sin(angle);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Clock hand (phase)
      const clockPhi = 2 * Math.PI * omega * t;
      const handX = clockCx + clockR * 0.7 * Math.cos(clockPhi - Math.PI / 2);
      const handY = clockCy + clockR * 0.7 * Math.sin(clockPhi - Math.PI / 2);

      ctx.strokeStyle = "#C0392B";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(clockCx, clockCy);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.fillStyle = "#C0392B";
      ctx.beginPath();
      ctx.arc(clockCx, clockCy, 4 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "This is TIME. ψ(t) = Ae^{-iEt/ℏ}. Phase advances at ω = E/ℏ. No deeper mechanism exists.",
        16 * devicePixelRatio,
        h - 24 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, omega]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function SceneWave1D({ speed }) {
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
      const N = 48,
        margin = 40 * devicePixelRatio,
        innerW = w - 2 * margin,
        innerH = h - 2 * margin,
        yMid = h / 2;
      const k1 = (2 * Math.PI) / (innerW / 6);
      const k2 = (2 * Math.PI) / (innerW / 5.5);
      const omega = 1.2;
      for (let i = 0; i < N; i++) {
        const x = margin + (i / (N - 1)) * innerW;
        const A1 = Math.exp(-Math.pow((x - w * 0.35) / (innerW * 0.15), 2));
        const A2 = Math.exp(-Math.pow((x - w * 0.65) / (innerW * 0.15), 2));
        const phase =
          k1 * x - omega * t + 0.4 * Math.sin(0.3 * x) + k2 * x * 0.2;
        const phase2 = k2 * x + omega * 0.8 * t + 0.2 * Math.cos(0.25 * x);
        const Re = A1 * Math.cos(phase) + A2 * Math.cos(phase2);
        const Im = A1 * Math.sin(phase) + A2 * Math.sin(phase2);
        const mag = Math.sqrt(Re * Re + Im * Im) + 1e-6;
        const angle = Math.atan2(Im, Re);
        const len = innerH * 0.35 * (mag / 1.2);
        const x2 = x + len * Math.cos(angle),
          y2 = yMid - len * Math.sin(angle);
        ctx.strokeStyle = "#bbb";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(x, yMid);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(x2, y2, 2.5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = margin + (i / (N - 1)) * innerW;
        const A1 = Math.exp(-Math.pow((x - w * 0.35) / (innerW * 0.15), 2));
        const A2 = Math.exp(-Math.pow((x - w * 0.65) / (innerW * 0.15), 2));
        const phase =
          k1 * x - omega * t + 0.4 * Math.sin(0.3 * x) + k2 * x * 0.2;
        const phase2 = k2 * x + omega * 0.8 * t + 0.2 * Math.cos(0.25 * x);
        const Re = A1 * Math.cos(phase) + A2 * Math.cos(phase2);
        const Im = A1 * Math.sin(phase) + A2 * Math.sin(phase2);
        const mag2 = Math.min(1.2, Re * Re + Im * Im);
        const y = yMid - innerH * 0.4 * mag2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Row of phasors ψ(x). Angle = phase; length ∝ |ψ|.",
        margin,
        margin * 0.7
      );
      ctx.fillText(
        "Bold curve ≈ |ψ|^2 envelope (toy)",
        margin,
        h - margin * 0.5
      );
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function ScenePathIntegral({ speed }) {
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

      // Draw paths
      pathData.forEach((path) => {
        const phi = path.S;
        const hue = ((((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 360;
        ctx.strokeStyle = `hsla(${hue},100%,50%,0.4)`;
        ctx.lineWidth = 1.5 * devicePixelRatio;
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

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Each path → e^{iS/ħ}. Colors = phase. Similar S → constructive interference.",
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

function SceneHilbertSphere({ speed }) {
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

function SceneNetwork({ speed, couple }) {
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

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Amplitude flows along edges. Red nodes = entangled (synchronized phase).",
        16 * devicePixelRatio,
        h - 24 * devicePixelRatio
      );

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [t, graph, couple]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function SceneField2D({ speed }) {
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

      // Split view: discrete oscillators on left, continuous field on right
      const mid = w / 2;

      // Left: Discrete oscillators
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("DISCRETE OSCILLATORS", 16 * devicePixelRatio, 30 * devicePixelRatio);

      const gridCols = 12, gridRows = 8;
      const cellW = mid / (gridCols + 1);
      const cellH = h / (gridRows + 1);

      for (let j = 0; j < gridRows; j++) {
        for (let i = 0; i < gridCols; i++) {
          const cx = cellW * (i + 1);
          const cy = cellH * (j + 1);
          const x = (i / gridCols) * 4 * Math.PI;
          const y = (j / gridRows) * 4 * Math.PI;

          // Wave packet traveling through
          const packetX = (t * 0.5) % (4 * Math.PI);
          const packetY = 2 * Math.PI;
          const dist = Math.sqrt((x - packetX) ** 2 + (y - packetY) ** 2);
          const amplitude = Math.exp(-dist * 0.8);

          const phase = x - t * 1.5;
          const val = amplitude * Math.sin(phase);

          // Draw oscillator as circle with phasor
          const radius = 8 * devicePixelRatio;
          const phasorLen = radius * 0.8;
          const phasorAngle = phase;

          // Circle
          ctx.strokeStyle = "#999";
          ctx.lineWidth = 1 * devicePixelRatio;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Phasor
          const phasorX = cx + phasorLen * Math.cos(phasorAngle) * amplitude;
          const phasorY = cy + phasorLen * Math.sin(phasorAngle) * amplitude;
          ctx.strokeStyle = `rgba(0, 100, 200, ${0.3 + amplitude * 0.7})`;
          ctx.lineWidth = 2 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(phasorX, phasorY);
          ctx.stroke();

          ctx.fillStyle = `rgba(0, 100, 200, ${0.3 + amplitude * 0.7})`;
          ctx.beginPath();
          ctx.arc(phasorX, phasorY, 2 * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Divider with arrow
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 5 * devicePixelRatio]);
      ctx.beginPath();
      ctx.moveTo(mid, 0);
      ctx.lineTo(mid, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow pointing right
      const arrowY = h * 0.5;
      ctx.fillStyle = "#666";
      ctx.font = `${20 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("→", mid, arrowY);
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("continuum limit", mid, arrowY + 25 * devicePixelRatio);

      // Right: Continuous field
      ctx.textAlign = "left";
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("CONTINUOUS FIELD", mid + 16 * devicePixelRatio, 30 * devicePixelRatio);

      const cols = 60, rows = 40;
      const dx = (w - mid) / cols;
      const dy = h / rows;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i / cols) * 4 * Math.PI;
          const y = (j / rows) * 4 * Math.PI;

          const packetX = (t * 0.5) % (4 * Math.PI);
          const packetY = 2 * Math.PI;
          const dist = Math.sqrt((x - packetX) ** 2 + (y - packetY) ** 2);
          const amplitude = Math.exp(-dist * 0.8);

          const phase = x - t * 1.5;
          const val = amplitude * Math.sin(phase);

          const brightness = 125 + val * 100;
          const hue = 200;
          const sat = 50 + amplitude * 50;
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${brightness / 2.55}%)`;
          ctx.fillRect(mid + i * dx, j * dy, dx + 1, dy + 1);
        }
      }

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Dense network → smooth field. Localized coherent excitation = 'particle'.",
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

function SceneMystery({ speed }) {
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

      // Draw multiple different clocks/periodic phenomena
      // Clock 1: Analog clock (top left)
      const c1x = w * 0.2, c1y = h * 0.25, r1 = Math.min(w, h) * 0.12;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(c1x, c1y, r1, 0, Math.PI * 2);
      ctx.stroke();
      const hour = (t * 0.3) % (2 * Math.PI);
      const minute = (t * 0.8) % (2 * Math.PI);
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c1x + r1 * 0.5 * Math.sin(hour), c1y - r1 * 0.5 * Math.cos(hour));
      ctx.stroke();
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c1x + r1 * 0.8 * Math.sin(minute), c1y - r1 * 0.8 * Math.cos(minute));
      ctx.stroke();

      // Clock 2: Pendulum (bottom left)
      const p2x = w * 0.25, p2y = h * 0.65;
      const swing = Math.sin(t * 1.2) * 0.6;
      const pendLen = Math.min(w, h) * 0.15;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(p2x, p2y);
      ctx.lineTo(p2x + pendLen * Math.sin(swing), p2y + pendLen * Math.cos(swing));
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p2x + pendLen * Math.sin(swing), p2y + pendLen * Math.cos(swing), 8 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();

      // Clock 3: Orbiting planet (right side)
      const orbitX = w * 0.7, orbitY = h * 0.4, orbitR = Math.min(w, h) * 0.18;
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 5 * devicePixelRatio]);
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, orbitR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      const orbitAngle = t * 0.5;
      const planetX = orbitX + orbitR * Math.cos(orbitAngle);
      const planetY = orbitY + orbitR * Math.sin(orbitAngle);
      ctx.fillStyle = "#E67E22";
      ctx.beginPath();
      ctx.arc(planetX, planetY, 8 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
      // Sun at center
      ctx.fillStyle = "#F39C12";
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, 12 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();

      // Clock 4: Heartbeat/pulse (bottom right)
      const pulseX = w * 0.7, pulseY = h * 0.75;
      const pulseW = w * 0.25;
      const pulse = Math.abs(Math.sin(t * 2)) > 0.7 ? 1 : 0;
      ctx.strokeStyle = "#C0392B";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      const steps = 50;
      for (let i = 0; i < steps; i++) {
        const x = pulseX - pulseW / 2 + (i / steps) * pulseW;
        const phase = (i / steps) * 4 * Math.PI - t * 2;
        const y = pulseY + Math.sin(phase) * 20 * devicePixelRatio * Math.exp(-Math.abs(i - steps / 2) / 10);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Big question mark in center
      const qx = w * 0.5, qy = h * 0.45;
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.font = `bold ${80 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", qx, qy);

      // Caption
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Multiple periodic phenomena. What synchronizes them? What IS the mechanism?",
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

function SceneDecoherence({ speed }) {
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
        ctx.fillStyle = "rgba(200, 100, 100, 0.4)";
        ctx.beginPath();
        ctx.arc(px, py, 2 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      // Caption
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Environment entanglement erases interference → definite outcomes emerge.",
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

function SceneClassical({ speed }) {
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
      for (let j = 0; j < 60; j++) {
        for (let i = 0; i < 120; i++) {
          const val = Math.sin(0.2 * i - 0.7 * t) * Math.cos(0.2 * j + 0.5 * t);
          const g = 180 + 30 * val;
          ctx.fillStyle = `rgba(${g},${g},${g},0.18)`;
          ctx.fillRect((i / 120) * w, (j / 60) * h, w / 120 + 1, h / 60 + 1);
        }
      }
      const cx = w * 0.55,
        cy = h * 0.55,
        R = h * 0.28;
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1.5 * devicePixelRatio;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R, R * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      const theta = t * 0.6;
      const px = cx + R * Math.cos(theta);
      const py = cy + R * 0.7 * Math.sin(theta);
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(px, py, 6 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
      const kx = w * 0.18,
        ky = h * 0.2,
        r = Math.min(w, h) * 0.08;
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.arc(kx, ky, r, 0, Math.PI * 2);
      ctx.stroke();
      const th = (t * 0.2) % (2 * Math.PI),
        tm = (t * 0.6) % (2 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(kx, ky);
      ctx.lineTo(
        kx + r * 0.6 * Math.cos(th - Math.PI / 2),
        ky + r * 0.6 * Math.sin(th - Math.PI / 2)
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(kx, ky);
      ctx.lineTo(
        kx + r * 0.9 * Math.cos(tm - Math.PI / 2),
        ky + r * 0.9 * Math.sin(tm - Math.PI / 2)
      );
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Decohered macro: trajectories & clocks atop faint phase fabric.",
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

function SceneArrowOfTime({ speed }) {
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

      // Timeline arrow across bottom
      const arrowY = h * 0.85;
      const arrowStartX = w * 0.1, arrowEndX = w * 0.9;

      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.stroke();

      // Arrowhead
      const headSize = 15 * devicePixelRatio;
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - headSize, arrowY - headSize / 2);
      ctx.lineTo(arrowEndX - headSize, arrowY + headSize / 2);
      ctx.fill();

      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText("PAST", arrowStartX, arrowY + 30 * devicePixelRatio);
      ctx.textAlign = "right";
      ctx.fillText("FUTURE", arrowEndX, arrowY + 30 * devicePixelRatio);
      ctx.textAlign = "center";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("TIME FLOWS →", w / 2, arrowY - 20 * devicePixelRatio);

      // Entropy visualization: particles spreading out
      const numParticles = 60;
      const spread = ((t * 0.3) % 3) + 1; // spreads over time, resets

      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2;
        const initialR = 40 * devicePixelRatio;
        const r = initialR * spread;
        const jitter = 20 * devicePixelRatio * Math.sin(t + i * 0.5);
        const px = w / 2 + r * Math.cos(angle) + jitter * Math.cos(angle * 3);
        const py = h * 0.4 + r * Math.sin(angle) * 0.6 + jitter * Math.sin(angle * 2);

        const alpha = Math.max(0.3, 1 - (spread - 1) / 2);
        ctx.fillStyle = `rgba(231, 76, 60, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 4 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      // Entropy label
      ctx.fillStyle = "#111";
      ctx.font = `${16 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      const entropyLevel = Math.floor(spread * 33);
      ctx.fillText(`Entropy S = ${entropyLevel} k_B`, w / 2, h * 0.15);

      // Broken egg metaphor
      const eggX = w * 0.75, eggY = h * 0.4;
      const brokenness = spread - 1; // 0 to 2

      if (brokenness < 0.5) {
        // Intact egg
        ctx.fillStyle = "#F39C12";
        ctx.beginPath();
        ctx.ellipse(eggX, eggY, 25 * devicePixelRatio, 32 * devicePixelRatio, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Broken pieces
        const pieces = 8;
        for (let i = 0; i < pieces; i++) {
          const angle = (i / pieces) * Math.PI * 2;
          const dist = brokenness * 40 * devicePixelRatio;
          const px = eggX + dist * Math.cos(angle);
          const py = eggY + dist * Math.sin(angle);
          ctx.fillStyle = "#F39C12";
          ctx.beginPath();
          ctx.arc(px, py, 8 * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Entropy increases → irreversibility. Microscopic laws are reversible, but we started low-entropy.",
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

function SceneQFT({ speed }) {
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

      // Background field (continuous field permeating space)
      const gridSize = 20 * devicePixelRatio;
      ctx.strokeStyle = "rgba(100, 100, 100, 0.15)";
      ctx.lineWidth = 0.5 * devicePixelRatio;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.fillStyle = "#666";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Quantum Field (permeates all space)", w / 2, 25 * devicePixelRatio);

      // Particles as localized excitations
      const particles = [
        { x: 0.25, y: 0.4, phase: 0, label: "e⁻" },
        { x: 0.5, y: 0.5, phase: 1, label: "γ" },
        { x: 0.75, y: 0.35, phase: 2, label: "e⁺" },
      ];

      particles.forEach((p, idx) => {
        const px = w * p.x;
        const py = h * p.y;

        // Wave packet visualization
        const waveR = 60 * devicePixelRatio;
        for (let r = 0; r < waveR; r += 3 * devicePixelRatio) {
          const phase = p.phase * Math.PI / 2 + r * 0.1 - t;
          const amplitude = Math.exp(-((r / waveR) ** 2) * 3) * Math.sin(phase * 3);
          const alpha = (1 - r / waveR) * 0.5 * (amplitude + 1) / 2;

          ctx.strokeStyle = `rgba(52, 152, 219, ${alpha})`;
          ctx.lineWidth = 2 * devicePixelRatio;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Core particle
        ctx.fillStyle = "#E74C3C";
        ctx.beginPath();
        ctx.arc(px, py, 8 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#111";
        ctx.font = `${14 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(p.label, px, py + waveR + 20 * devicePixelRatio);
      });

      // Creation operator notation
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText("Particle = field excitation:", 16 * devicePixelRatio, h * 0.75);
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("a†|0⟩ = |1 particle⟩", 16 * devicePixelRatio, h * 0.75 + 25 * devicePixelRatio);

      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.fillText(
        "Fields are fundamental. Particles are ripples in the field.",
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

function SceneBornRule({ speed }) {
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

      // Superposition state visualization
      const cy = h * 0.3;
      const statePositions = [w * 0.25, w * 0.5, w * 0.75];
      const amplitudes = [
        { re: 0.6, im: 0.0 },
        { re: 0.4, im: 0.5 },
        { re: -0.3, im: 0.4 }
      ];

      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("|ψ⟩ = superposition", w / 2, 30 * devicePixelRatio);

      // Draw each amplitude as a phasor
      amplitudes.forEach((amp, idx) => {
        const px = statePositions[idx];
        const mag = Math.sqrt(amp.re * amp.re + amp.im * amp.im);
        const angle = Math.atan2(amp.im, amp.re);
        const scale = 50 * devicePixelRatio;

        // Circle
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(px, cy, scale, 0, Math.PI * 2);
        ctx.stroke();

        // Phasor
        const endX = px + scale * mag * Math.cos(angle + t * 0.5);
        const endY = cy + scale * mag * Math.sin(angle + t * 0.5);
        ctx.strokeStyle = "#3498DB";
        ctx.lineWidth = 3 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(px, cy);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.fillStyle = "#3498DB";
        ctx.beginPath();
        ctx.arc(endX, endY, 4 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // State label
        ctx.fillStyle = "#111";
        ctx.font = `${11 * devicePixelRatio}px system-ui`;
        ctx.fillText(`|${idx}⟩`, px, cy + scale + 25 * devicePixelRatio);
      });

      // Arrow down
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 2 * devicePixelRatio;
      const midY = h * 0.5;
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.45);
      ctx.lineTo(w / 2, midY);
      ctx.stroke();
      ctx.fillStyle = "#666";
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Measurement", w / 2 + 50 * devicePixelRatio, h * 0.48);

      // Probabilities (bars)
      const barY = h * 0.65;
      const barHeight = h * 0.2;
      const barWidth = w * 0.15;

      amplitudes.forEach((amp, idx) => {
        const px = statePositions[idx];
        const prob = amp.re * amp.re + amp.im * amp.im;
        const barH = barHeight * prob;

        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(px - barWidth / 2, barY + barHeight - barH, barWidth, barH);

        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.strokeRect(px - barWidth / 2, barY, barWidth, barHeight);

        // Probability label
        ctx.fillStyle = "#111";
        ctx.font = `${12 * devicePixelRatio}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(`P = ${prob.toFixed(2)}`, px, barY + barHeight + 25 * devicePixelRatio);
      });

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Born rule: P(outcome) = |⟨outcome|ψ⟩|². Postulate or derivable? Still debated.",
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

function SceneSpacetime({ speed }) {
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

      // Spacetime diagram (Minkowski)
      const cx = w * 0.3, cy = h * 0.6;
      const axisLen = Math.min(w, h) * 0.35;

      // Axes
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2 * devicePixelRatio;
      // Time axis (vertical)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - axisLen);
      ctx.stroke();
      // Space axis (horizontal)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + axisLen, cy);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#111";
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("ct", cx, cy - axisLen - 15 * devicePixelRatio);
      ctx.fillText("x", cx + axisLen + 20 * devicePixelRatio, cy);

      // Light cone
      ctx.strokeStyle = "rgba(255, 200, 0, 0.5)";
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + axisLen * 0.7, cy - axisLen * 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - axisLen * 0.7, cy - axisLen * 0.7);
      ctx.stroke();

      ctx.fillStyle = "#F39C12";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.fillText("light cone", cx + axisLen * 0.5, cy - axisLen * 0.5 - 10 * devicePixelRatio);

      // Worldline
      const worldlinePoints = 20;
      ctx.strokeStyle = "#E74C3C";
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.beginPath();
      for (let i = 0; i < worldlinePoints; i++) {
        const frac = i / worldlinePoints;
        const x = cx + axisLen * 0.3 * Math.sin(frac * Math.PI * 2 + t * 0.5) * frac;
        const y = cy - axisLen * frac * 0.9;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#E74C3C";
      ctx.font = `${11 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText("worldline", cx + 30 * devicePixelRatio, cy - axisLen * 0.5);

      // Proper time formula
      const boxX = w * 0.65, boxY = h * 0.3;
      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Proper time τ:", boxX, boxY);
      ctx.font = `${12 * devicePixelRatio}px system-ui`;
      ctx.fillText("dτ² = dt² - dx²/c²", boxX, boxY + 30 * devicePixelRatio);
      ctx.fillText("Phase = ∫ mc² dτ / ℏ", boxX, boxY + 60 * devicePixelRatio);

      // Unification message
      ctx.font = `${13 * devicePixelRatio}px system-ui`;
      ctx.fillText("Space + Time = Spacetime", boxX, boxY + 100 * devicePixelRatio);

      ctx.fillStyle = "#111";
      ctx.font = `${14 * devicePixelRatio}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(
        "Phase accumulation encodes both time AND space. But where does metric g_μν come from?",
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

function SceneQuantumGravity({ speed }) {
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

// Level 11: String Theory
function SceneStringTheory({ speed }) {
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
      ctx.fillText("STRING THEORY: Vibrating 1D Objects", cx, 30 * devicePixelRatio);

      // Draw multiple vibrating strings
      const numStrings = 3;
      const stringWidth = w * 0.6;
      const stringSpacing = h * 0.2;
      const startY = cy - stringSpacing;

      for (let s = 0; s < numStrings; s++) {
        const y = startY + s * stringSpacing;
        const phase = t * 0.5 + s * Math.PI * 0.7;
        const freq = 2 + s; // Different vibration modes

        // Draw string with sine wave
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${200 + s * 40}, 70%, 50%)`;
        ctx.lineWidth = 3 * devicePixelRatio;

        const numPoints = 100;
        for (let i = 0; i <= numPoints; i++) {
          const x = cx - stringWidth / 2 + (i / numPoints) * stringWidth;
          const amplitude = 20 * devicePixelRatio * (1 + s * 0.3);
          const offset = amplitude * Math.sin((i / numPoints) * Math.PI * freq + phase);
          if (i === 0) {
            ctx.moveTo(x, y + offset);
          } else {
            ctx.lineTo(x, y + offset);
          }
        }
        ctx.stroke();

        // Label each mode
        ctx.font = `${12 * devicePixelRatio}px sans-serif`;
        ctx.fillStyle = "#666";
        ctx.textAlign = "left";
        const labels = ["Graviton (spin-2)", "Photon (spin-1)", "Scalar"];
        ctx.fillText(
          labels[s],
          cx + stringWidth / 2 + 10 * devicePixelRatio,
          y
        );
      }

      // Draw dimension indicator
      ctx.font = `${14 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(
        "10D spacetime (9 space + 1 time)",
        cx,
        h - 50 * devicePixelRatio
      );
      ctx.fillText(
        "6 extra dimensions compactified at Planck scale",
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

// Level 12: Loop Quantum Gravity
function SceneLoopQG({ speed }) {
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

// Level 13: Emergent Gravity from Entanglement
function SceneEmergentGravity({ speed }) {
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
      ctx.fillText("EMERGENT GRAVITY: Spacetime from Entanglement", cx, 30 * devicePixelRatio);

      // Draw entangled qubit network
      const numQubits = 12;
      const radius = 120 * devicePixelRatio;
      const qubits = [];
      for (let i = 0; i < numQubits; i++) {
        const angle = (i / numQubits) * Math.PI * 2;
        qubits.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        });
      }

      // Draw entanglement threads (thicker = more entanglement = closer in emergent space)
      for (let i = 0; i < numQubits; i++) {
        for (let j = i + 1; j < numQubits; j++) {
          const distance = Math.abs(i - j);
          const wrappedDist = Math.min(distance, numQubits - distance);
          const entanglement = 1 / (1 + wrappedDist * 0.5);

          if (entanglement > 0.3) {
            const phase = Math.sin(t * 0.2 + i + j) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.moveTo(qubits[i].x, qubits[i].y);
            ctx.lineTo(qubits[j].x, qubits[j].y);
            ctx.strokeStyle = `rgba(155, 89, 182, ${entanglement * phase * 0.5})`;
            ctx.lineWidth = entanglement * 4 * devicePixelRatio;
            ctx.stroke();
          }
        }
      }

      // Draw qubits
      qubits.forEach((q, idx) => {
        const phase = Math.sin(t * 0.5 + idx * 0.5) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(142, 68, 173, ${phase})`;
        ctx.fill();
        ctx.strokeStyle = "#8e44ad";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.stroke();
      });

      // Center label
      ctx.font = `${14 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#8e44ad";
      ctx.textAlign = "center";
      ctx.fillText("ER = EPR", cx, cy);
      ctx.font = `${11 * devicePixelRatio}px sans-serif`;
      ctx.fillText("Wormhole ≈ Entanglement", cx, cy + 18 * devicePixelRatio);

      // Info text
      ctx.font = `${13 * devicePixelRatio}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(
        "Distance = 1 / (entanglement strength)",
        cx,
        h - 50 * devicePixelRatio
      );
      ctx.fillText(
        "Spacetime is emergent illusion — entanglement is fundamental",
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
          then journey through fourteen levels of reality—from classical emergence to quantum foundations, through competing theories of quantum gravity, and back—to discover the irreducible core: <strong>quantum phase rotation</strong>.
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
          {active === 4 && (
            <SceneNetwork speed={params.speed} couple={params.couple} />
          )}
          {active === 5 && <SceneHilbertSphere speed={params.speed} />}
          {active === 6 && <SceneBornRule speed={params.speed} />}
          {active === 7 && <ScenePathIntegral speed={params.speed} />}
          {active === 8 && (
            <ScenePhasor omega={params.omega} speed={params.speed} />
          )}
          {active === 9 && <SceneSpacetime speed={params.speed} />}
          {active === 10 && <SceneQuantumGravity speed={params.speed} />}
          {active === 11 && <SceneStringTheory speed={params.speed} />}
          {active === 12 && <SceneLoopQG speed={params.speed} />}
          {active === 13 && <SceneEmergentGravity speed={params.speed} />}
        </Card>
        <Companion active={active} />
      </div>
      <div className="mt-4 mb-8 rounded-2xl border shadow-sm bg-blue-50 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-sm">
            <span className="font-semibold">Math:</span> {INFO[active].math}
          </div>
          <div className="text-xs opacity-70">{INFO[active].link}</div>
        </div>
      </div>
    </div>
  );
}
