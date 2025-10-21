export const DEEP = {
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
    why: `This explains irreversibility without contradicting reversible fundamental laws. **Memory** requires entropy increase (writing to a brain increases entropy). **Causality** is directional because we can manipulate the past via records, but not the future. The thermodynamic arrow *is* the psychological arrow.

**The Great Mystery of Initial Conditions**: But this explanation pushes the question back one level: **Why did the universe start with such incredibly low entropy?** The Big Bang had an entropy of ~$10^{88}$ k_B, while today's observable universe has ~$10^{103}$ k_B. If we consider all possible microstates consistent with the universe's energy, the initial state was extraordinarily unlikely—one in $10^{10^{123}}$ or so. **Why this special initial condition?** This remains one of cosmology's deepest unsolved questions. The arrow of time is "explained" by thermodynamics, but the explanation itself rests on an unexplained cosmic boundary condition.`,
    bridge: `Decoherence itself is an entropy-increasing process. Now: what **is** the quantum substrate that decoheres and thermalizes? ↓ Level 3`
  },
  3: {
    problem: `We've been talking about "wavefunctions" and "particles," but reality is deeper. What **are** particles? Why do field excitations come in discrete packets?`,
    idea: `**Quantum Field Theory (QFT)**: The universe is filled with **fields**—one for each particle type. The electron field $\\hat{\\psi}_e(x)$, photon field $\\hat{A}_\\mu(x)$, etc. A "particle" is an **excitation**: $a^\\dagger|0\\rangle$ creates a ripple in the field. Multiple excitations = multiple particles. This is **second quantization**: fields are operators, not wavefunctions.`,
    why: `QFT unifies special relativity and quantum mechanics. It explains particle creation/annihilation (Feynman diagrams), the Pauli exclusion principle (fermion fields anticommute), and the Casimir effect (vacuum energy). Particles aren't fundamental—**fields** are.

**Making it work—Renormalization**: When calculating interactions in QFT, infinities appear (point-like particles interacting at zero distance). Physicists developed **renormalization**—a systematic technique to absorb infinities into redefined physical constants (mass, charge). This isn't a mathematical trick; it's a deep insight about how physics works at different energy scales. The success of renormalization is a huge clue that QFT is the right framework, even though we don't fully understand why it works so well.`,
    bridge: `QFT is the framework—but which fields actually exist in nature? ↓ Level 4`
  },
  4: {
    problem: `QFT says reality is fields—but which fields specifically? What is the actual content of our universe?`,
    idea: `**The Standard Model**: The most experimentally verified theory in physics. It catalogs the specific fields that make up reality:

**Matter fields (fermions):**
- **Quarks** (6 types): up, down, charm, strange, top, bottom—organized in 3 generations
- **Leptons** (6 types): electron, muon, tau, and their neutrinos (νₑ, νμ, ντ)

**Force carriers (bosons):**
- **Photon (γ)**: electromagnetic force
- **W±, Z bosons**: weak nuclear force
- **Gluons (g, 8 types)**: strong nuclear force
- **Higgs boson**: gives mass to particles

**Four fundamental forces:**
1. Electromagnetic (photons)
2. Weak (W±, Z)
3. Strong (gluons)
4. Gravity (not included—still classical!)

The first three forces are **unified** in the Standard Model via gauge symmetry. Electroweak unification connects EM and weak forces. Quantum chromodynamics (QCD) describes the strong force.`,
    why: `This is the most experimentally verified theory in physics—tested to 1 part in 10 billion at particle colliders. These specific 17 fields (12 matter + 4 force + Higgs) make up everything we've ever observed. The Standard Model grounds abstract QFT in concrete reality. **But it's incomplete**: no gravity, no dark matter, no explanation for mass hierarchy or why these specific particles exist.`,
    bridge: `These fields don't live in isolation—they interact and couple. How do field modes exchange amplitude? ↓ Level 5`
  },
  5: {
    problem: `Systems don't evolve in isolation. Atoms couple to photons; spins couple to neighbors. How does quantum information **flow between subsystems**? What is entanglement, mechanically?`,
    idea: `Write the state as $|\\psi\\rangle = \\sum_i c_i |i\\rangle$ in some basis. Evolution becomes:
$$
i\\hbar \\dot{c}_i = \\sum_j H_{ij} c_j
$$
Each $c_i$ is a complex amplitude (a rotating phasor). The off-diagonal terms $H_{ij}$ ($i \\neq j$) are **couplings**: they let amplitude leak from node $j$ to node $i$. Entanglement is just correlated phase across nodes.`,
    why: `This reveals quantum mechanics as a **network of phase rotations** with amplitude flowing along edges. Time evolution is the synchronized dance of all these phasors. Entanglement isn't spooky—it's phase correlation enforced by coupling terms.`,
    bridge: `We keep talking about energy (H) and the Hamiltonian generating time evolution. But what IS energy? Why does it have this role? ↓ Level 6`
  },
  6: {
    problem: `We keep talking about energy and the Hamiltonian. But what IS energy? Why does it generate time evolution?`,
    idea: `**Noether's Theorem** (1915): One of the most profound insights in physics. It connects **symmetries** to **conservation laws**:

**Continuous symmetry → Conserved quantity**

- **Time-translation symmetry** (physics doesn't change over time) → **Energy conservation**
- **Space-translation symmetry** (physics same everywhere) → **Momentum conservation**
- **Rotational symmetry** → **Angular momentum conservation**

Mathematically: If the Lagrangian $L$ doesn't depend on time explicitly:
$$
\\frac{\\partial L}{\\partial t} = 0 \\Rightarrow E \\text{ is conserved}
$$

The conserved quantity (energy) is the **generator** of the symmetry transformation (time evolution). This is why the Hamiltonian $H$ appears in the evolution operator $e^{-iHt/\\hbar}$—energy generates time translations!`,
    why: `This connects abstract mathematics to physical observables. Energy isn't just a number we measure—it's the conserved quantity that arises from time-translation symmetry. The Hamiltonian generates time evolution BECAUSE energy is conserved. This explains why $H$ has such a central role in quantum mechanics. It's not arbitrary—it's dictated by the symmetry structure of nature.

**Deep implication**: Every conservation law reflects an underlying symmetry. Conservation isn't imposed—it emerges from the geometry of physical law.`,
    bridge: `Now we understand why H generates time evolution. Back to the Hilbert space structure and unitary dynamics. ↓ Level 7`
  },
  7: {
    problem: `Why does quantum mechanics use complex numbers? Why unitary evolution? Why does the time-evolution operator have the form $e^{-iHt/\\hbar}$?`,
    idea: `The state of a system is a vector $|\\psi\\rangle$ in Hilbert space. Time evolution is a **rotation** that preserves the norm (probability):
$$
|\\psi(t)\\rangle = e^{-iHt/\\hbar} |\\psi(0)\\rangle
$$
This is **unitary**: $U^\\dagger U = I$. The generator $H$ (Hamiltonian) determines the axis and rate of rotation. Energy eigenvalues are rotation frequencies.

For a two-level quantum system (qubit), this rotation can be visualized on the **Bloch sphere**—a unit sphere where the north and south poles represent basis states $|0\\rangle$ and $|1\\rangle$, and any point on the surface represents a pure quantum state. Time evolution traces a path on this sphere.`,
    why: `Hilbert space is the natural geometry for **probability amplitudes**. Unitary evolution is the only way to evolve probabilities while preserving total probability. The **Bloch sphere** provides intuition: quantum states live on a sphere's surface, and time evolution rotates them. The mystery of quantum mechanics is: **why are probabilities computed from interfering amplitudes instead of added directly?**`,
    bridge: `But measurement *doesn't* give amplitudes—it gives definite outcomes with probabilities. Where does that come from? ↓ Level 8`
  },
  8: {
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
    bridge: `Accepting Born rule for now: where does unitary evolution itself come from? ↓ Level 9`
  },
  9: {
    problem: `The Schrödinger equation gives the wavefunction's evolution, but **where does that equation come from**? Is there a deeper principle?`,
    idea: `**Feynman's path integral**: The amplitude to go from $A$ to $B$ is a sum over *every possible path* connecting them:
$$
\\Psi(B) = \\sum_{\\text{all paths } A \\to B} e^{iS[\\text{path}]/\\hbar}
$$
where $S$ is the **classical action** $\\int L \\, dt$. Paths near the stationary-action path (the classical trajectory) have similar phases → they interfere constructively. Wild paths cancel out.`,
    why: `This explains **why classical mechanics works**: it's the stationary-phase approximation of quantum mechanics. The principle of least action isn't fundamental—it's an **interference effect**. And it reveals what's truly fundamental: **phase accumulation**.`,
    bridge: `Every path contributes a phase $e^{iS/\\hbar}$. The action $S = \\int E \\, dt - \\int p \\, dx$ has a time part: $E \\cdot t$. This is where time comes from. ↓ Level 10`
  },
  10: {
    problem: `We've peeled away every layer. What is the **irreducible core**—the atomic mechanism that generates time itself?`,
    idea: `Every quantum state has an internal phase that rotates:
$$
\\psi(t) = A e^{-iEt/\\hbar}
$$
The phase advances at angular frequency $\\omega = E/\\hbar$. This is the **fundamental clock**.

An electron at rest ($E = mc^2$) has a Compton frequency of ~$10^{20}$ Hz. **This phase rotation IS time.** There is no deeper mechanism. Time is the rate at which quantum phase accumulates.`,
    why: `This is the bottom (for time). Energy and frequency are the same thing ($E = \\hbar \\omega$). Every particle is a clock. Every interaction synchronizes clocks. Relativity's "proper time" is literally the phase accumulated along a worldline. **Time is not a backdrop—it's the phase of the wavefunction.**`,
    bridge: `But we've talked about time without mentioning **space**. Einstein unified them. What about spacetime? ↓ Level 11`
  },
  11: {
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
    bridge: `Spacetime in GR is classical. But quantum fields live on it. What about quantum **spacetime itself**? ↓ Level 12`
  },
  12: {
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
    bridge: `Three main approaches compete. Let's explore each in depth. → Level 13`
  },
  13: {
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
    bridge: `String theory adds dimensions. Loop Quantum Gravity takes the opposite approach: keep 4D spacetime but **quantize geometry itself**. → Level 14`
  },
  14: {
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
    bridge: `LQG quantizes spacetime but keeps it fundamental. The most radical idea: **spacetime isn't fundamental at all**—it emerges from entanglement. → Level 15`
  },
  15: {
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
