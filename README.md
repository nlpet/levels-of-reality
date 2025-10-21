# Levels of Reality: A Journey to Quantum Time

An interactive educational visualization exploring the fundamental nature of time, from classical physics down to quantum foundations and back up through quantum gravity theories.

## 🌌 What Is This?

Journey through 16 levels of reality to discover what generates time itself:
- Start with the everyday mystery of ticking clocks
- Descend through quantum mechanics, fields, and entanglement
- Reach the foundation: quantum phase rotation
- Ascend through spacetime and competing quantum gravity theories
- Return with deeper understanding

**The answer:** Time emerges from quantum phase rotation—every particle is an internal clock.

## 🎯 Features

- **16 Interactive Levels**: From classical emergence to quantum gravity
- **Real-time Visualizations**: Canvas-based animations for each concept
- **Companion Explanations**: Deep dive into problem/idea/why/bridge for each level
- **Modern Physics**: Includes Standard Model, Noether's Theorem, String Theory, Loop Quantum Gravity, and Emergent Spacetime
- **Pedagogically Structured**: Detective-story approach, building intuition layer by layer

## 🚀 Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `levels-of-reality`
2. Don't initialize with README (we already have one)

### Step 2: Initialize Git and Push

```bash
cd /Users/norapetrova/Projects/experiments/physics/levels-of-reality/levels-of-reality

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Levels of Reality interactive demo"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/levels-of-reality.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
4. The workflow will automatically run on push to `main`

### Step 4: Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/levels-of-reality/
```

The GitHub Actions workflow will automatically build and deploy on every push to `main`.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start dev server (requires Node.js 20.19+ or 22.12+)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # React components (Sidebar, Card, Companion, Markdown)
├── data/            # Level data (levels.js, companion.js)
├── scenes/          # Canvas visualizations for each level
├── utils/           # Hooks (useTicker)
└── App.jsx          # Main application (88 lines!)
```

## 🎓 The 16 Levels

0. **The Mystery: Classical Time** - Where does time come from?
1. **Decoherence** - How quantum becomes classical
2. **Arrow of Time** - Why forward? (with initial entropy mystery)
3. **Quantum Fields (QFT)** - Particles as field excitations (with renormalization)
4. **Standard Model** - The 17 fundamental fields
5. **Entanglement** - How systems couple
6. **Symmetry & Conservation** - Noether's theorem
7. **Bloch Sphere** - Unitary evolution visualized
8. **Born Rule** - Why |ψ|²?
9. **Path Integral** - Summing all histories
10. **Phase Rotation** - The foundation: time IS quantum phase
11. **Spacetime & Relativity** - Unification of space and time
12. **Quantum Gravity** - The frontier
13. **String Theory** - Vibrating geometry in 10D
14. **Loop Quantum Gravity** - Discrete spacetime atoms
15. **Emergent Gravity** - Spacetime from entanglement (ER=EPR)

## 🧮 Technologies

- **React 19** - UI framework
- **Vite 7** - Build tool
- **Canvas API** - Real-time visualizations
- **KaTeX** - LaTeX math rendering
- **React Markdown** - Formatted explanations

## 📝 Credits

Built with insights from modern theoretical physics, including concepts from:
- Quantum field theory and the Standard Model
- Emmy Noether's profound symmetry theorems
- Feynman's path integral formulation
- Carlo Rovelli's relational quantum mechanics
- Juan Maldacena's AdS/CFT correspondence
- Susskind & Maldacena's ER=EPR conjecture

## 📄 License

MIT License - Feel free to use and modify for educational purposes.

---

**Journey through the levels. Discover the foundation. Return transformed.** ↻
