# 🐜 Evolutionary Ant Simulation: GA vs PSO Neural Network Foraging

**A fun, interactive p5.js simulation demonstrating how neural networks can be optimized using evolutionary algorithms — no backpropagation required.**

## 🎯 Overview

This project visualizes two colonies of ants — one powered by **Genetic Algorithms (GA)** and the other by **Particle Swarm Optimization (PSO)** — as they compete to find food in a shared environment.

Each ant is controlled by a simple **neural network brain** that takes sensory input (like nearby food direction) and decides how to move.  
Instead of using gradient descent or backpropagation, the ants’ neural weights are tuned using **evolutionary methods**.

> Backpropagation isn’t the only way to make neural networks learn!

## 🧬 Core Concepts

| Concept                               | Description                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| **Neural Networks**                   | Each ant has a tiny feedforward network controlling its movement.              |
| **Genetic Algorithm (GA)**            | Red ants evolve via selection, crossover, and mutation based on fitness.       |
| **Particle Swarm Optimization (PSO)** | Blue ants adjust their weights based on personal and global best performances. |
| **Fitness Function**                  | The more food an ant collects, the higher its fitness.                         |
| **Emergent Behavior**                 | Over generations, each team should learn to forage more efficiently.           |

## 🕹️ Try It Out

You can run this project directly in your browser using the [p5.js online editor](https://editor.p5js.org):

1. Copy the contents of [`main.js`](./src/main.js) and [`index.html`](./index.html).
2. Paste them into [editor.p5js.org](https://editor.p5js.org).
3. Press ▶️ **Run** to start the simulation.
4. Click on the canvas to add new food sources!

## 🧠 How It Works

Each frame, every ant:

1. **Senses** nearby food within a certain radius.
2. **Feeds inputs** (angle, distance, etc.) into its neural network.
3. **Receives outputs**: steering direction and speed.
4. **Moves**, collects food, and earns a fitness score.

Every few seconds (a generation):

- GA ants reproduce using selection, crossover, and mutation.
- PSO ants update their neural weights based on swarm dynamics.
- Fitness scores are reset, and evolution continues.

## 📈 Example Roadmap

### ✅ Version 1 — Baseline Simulation

- Environment, ants, food, fitness tracking
- Clicking adds food
- Two teams (red = GA, blue = PSO)

### 🚧 Version 2 — Learning Systems

- Neural network brains
- GA selection, crossover, mutation
- PSO swarm update logic

### 🔬 Version 3 — Visualization

- Fitness graphs and statistics
- Highlight top-performing ants
- Sliders for mutation rate, swarm size, etc.

### 🌟 Version 4 — Polish

- Save/load best ants
- Obstacle placement
- Real-time weight visualization

## 💡 Why This Project Exists

When teaching about neural networks, students often learn **backpropagation** as the only training method.  
This project demonstrates that **evolutionary computation** — through GA or PSO — can also discover effective network weights, even when gradients are unavailable or non-differentiable.

It’s a fun way to explore **AI without calculus**, and a great foundation for learning about:

- Emergent behavior in agent-based systems
- Alternative optimization strategies
- Interactive, visual AI experiments

## 🧰 Tech Stack

- **JavaScript / p5.js** — rendering and simulation logic
- **dat.GUI (optional)** — for live parameter tuning
- **HTML/CSS** — for embedding and controls
