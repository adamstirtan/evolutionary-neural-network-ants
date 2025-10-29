# Evolutionary Ant Simulation: GA vs PSO vs Backpropagation

**A fun, interactive p5.js simulation comparing how neural networks can be optimized using evolutionary algorithms vs traditional backpropagation.**

![Simulation Preview](https://github.com/user-attachments/assets/0bff7457-6213-4bb2-9fc2-d52af7c2defe)

## Overview

This project visualizes three colonies of ants — powered by **Genetic Algorithms (GA)**, **Particle Swarm Optimization (PSO)**, and **Backpropagation (BP)** — as they compete to find food in a shared environment.

Each ant is controlled by a simple **neural network brain** that takes sensory input (like nearby food direction) and decides how to move.  
The GA and PSO teams use **evolutionary methods** to optimize neural weights, while the BP team uses **traditional gradient descent**.

> Compare evolutionary approaches with traditional backpropagation to see which learns faster!

## Core Concepts

| Concept                               | Description                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| **Neural Networks**                   | Each ant has a tiny feedforward network controlling its movement.              |
| **Genetic Algorithm (GA)**            | Red ants evolve via selection, crossover, and mutation based on fitness.       |
| **Particle Swarm Optimization (PSO)** | Cyan ants adjust their weights based on personal and global best performances. |
| **Backpropagation (BP)**              | Yellow ants use gradient descent to learn from reward signals.                 |
| **Fitness Function**                  | The more food an ant collects, the higher its fitness.                         |
| **Emergent Behavior**                 | Over generations, each team should learn to forage more efficiently.           |

## Quick Start

### Running Locally

1. Clone this repository:

   ```bash
   git clone https://github.com/adamstirtan/evolutionary-neural-network-ants.git
   cd evolutionary-neural-network-ants
   ```

2. Open your browser and navigate open the `index.html` file

3. Watch the ants learn! Click on the canvas to add more food.

## How It Works

### Neural Network Architecture

Each ant's brain is a simple feedforward neural network:

- **Input Layer (5 neurons):**

  - Food angle (relative to ant's heading)
  - Food distance (normalized)
  - Velocity X
  - Velocity Y
  - Bias (constant 1.0)

- **Hidden Layer (4 neurons):**

  - Uses tanh activation function

- **Output Layer (2 neurons):**
  - Turn angle (-π/4 to π/4)
  - Movement speed (0 to max speed)

### Simulation Loop

Each frame (targeting 60 FPS):

1. **Sensing:** Each ant detects the nearest food
2. **Decision:** Neural network processes inputs → outputs
3. **Action:** Ant moves based on network outputs
4. **Collection:** Ant collects food if close enough (gains fitness)

Every **5 seconds** (300 frames = 1 generation):

- **GA Team:** Performs tournament selection, crossover, and mutation
- **PSO Team:** Updates velocities and positions based on swarm dynamics
- **BP Team:** Applies gradient descent to adjust weights based on rewards
- All teams spawn in new random positions
- More food is added to the environment

### Genetic Algorithm (GA)

The red ants evolve using these steps:

1. **Fitness Evaluation:** Score based on food collected
2. **Selection:** Tournament selection (best of 3 random ants)
3. **Crossover:** Single-point crossover between parent weights
4. **Mutation:** Gaussian noise applied to weights
5. **Elitism:** Best ant always survives to next generation

### Particle Swarm Optimization (PSO)

The cyan ants optimize using swarm intelligence:

1. **Fitness Evaluation:** Score based on food collected
2. **Personal Best:** Each ant tracks its best weight configuration
3. **Global Best:** Track the best weights across all ants
4. **Velocity Update:**
   ```
   v = w*v + c1*r1*(pBest - x) + c2*r2*(gBest - x)
   ```
5. **Position Update:** Apply velocity to weights

### Backpropagation (BP)

The yellow ants learn using gradient descent:

1. **Fitness Evaluation:** Score based on food collected
2. **Experience Collection:** Store state-action pairs during episode
3. **Reward Calculation:** Compute fitness improvement as reward signal
4. **Gradient Computation:** Calculate gradients via backpropagation
5. **Weight Update:** Apply gradients using learning rate (REINFORCE-style policy gradient)

## Interactive Controls

### Canvas Interaction

- **Click anywhere** on the canvas to spawn new food

### Active Teams

- Enable/disable which teams participate: **GA**, **PSO**, **BP**
- These checkboxes are only editable while the simulation is **paused**
- Changing team selection resets the simulation to apply the change

### GA Parameters

- **Mutation Rate:** Controls how much random variation is added (0.01 - 0.5)
- **Crossover Rate:** Probability of combining two parents (0.5 - 1.0)

### PSO Parameters

- **Inertia Weight:** How much previous velocity influences movement (0.4 - 0.9)
- **Cognitive Weight:** Attraction to personal best position (0.5 - 2.5)
- **Social Weight:** Attraction to global best position (0.5 - 2.5)

### BP Parameters

- **Learning Rate:** Step size for gradient descent updates (0.001 - 0.1)

### Buttons

- **Reset Simulation:** Restart with new random populations
- **Pause/Resume:** Pause or resume the simulation

## 📁 Project Structure

```
/
├── index.html          # Main HTML file with UI
├── src/
│   ├── main.js        # Simulation loop and coordination
│   ├── ant.js         # Ant and Food classes
│   ├── neural.js      # Neural network implementation with backpropagation
│   ├── ga.js          # Genetic Algorithm implementation
│   ├── pso.js         # Particle Swarm Optimization implementation
│   └── bp.js          # Backpropagation implementation
├── README.md          # This file
└── LICENSE            # MIT License
```

## Learning Outcomes

This simulation demonstrates:

1. **Multiple optimization approaches** - Compare evolutionary methods (GA, PSO) with gradient-based learning (backpropagation)
2. **Emergent behavior** - Simple rules at the individual level lead to complex foraging behaviors at the colony level
3. **Algorithm comparison** - Observe how different optimization strategies perform on the same task
4. **Hyperparameter impact** - Adjust sliders to see how parameters affect learning speed and quality

## Observing Learning

Watch for these patterns as generations progress:

- **Early generations:** Ants move randomly, rarely finding food
- **Middle generations:** Ants start to move toward nearby food more consistently
- **Later generations:** Ants efficiently navigate to food sources

Compare the three teams:

- **GA** tends to have more diversity but can be slower to converge
- **PSO** often converges faster but may get stuck in local optima
- **BP** learns through gradients and may adapt quickly if the reward signal is clear

## 📚 Further Reading

- [Genetic Algorithms in Neural Network Training](https://en.wikipedia.org/wiki/Neuroevolution)
- [Particle Swarm Optimization](https://en.wikipedia.org/wiki/Particle_swarm_optimization)
- [p5.js Documentation](https://p5js.org/reference/)
- [Evolutionary Computation: A Unified Approach](https://mitpress.mit.edu/books/evolutionary-computation)

---

**Enjoy watching the ants learn! 🐜🧠**
