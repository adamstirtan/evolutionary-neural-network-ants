# 🐜 Evolutionary Ant Simulation: GA vs PSO Neural Network Foraging

**A fun, interactive p5.js simulation demonstrating how neural networks can be optimized using evolutionary algorithms — no backpropagation required.**

![Simulation Preview](https://github.com/user-attachments/assets/f4517841-dcd9-48de-b1f0-252b72cc9af5)

## 🎯 Overview

This project visualizes two colonies of ants — one powered by **Genetic Algorithms (GA)** and the other by **Particle Swarm Optimization (PSO)** — as they compete to find food in a shared environment.

Each ant is controlled by a simple **neural network brain** that takes sensory input (like nearby food direction) and decides how to move.  
Instead of using gradient descent or backpropagation, the ants' neural weights are tuned using **evolutionary methods**.

> Backpropagation isn't the only way to make neural networks learn!

## 🧬 Core Concepts

| Concept                               | Description                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| **Neural Networks**                   | Each ant has a tiny feedforward network controlling its movement.              |
| **Genetic Algorithm (GA)**            | Red ants evolve via selection, crossover, and mutation based on fitness.       |
| **Particle Swarm Optimization (PSO)** | Blue ants adjust their weights based on personal and global best performances. |
| **Fitness Function**                  | The more food an ant collects, the higher its fitness.                         |
| **Emergent Behavior**                 | Over generations, each team should learn to forage more efficiently.           |

## 🚀 Quick Start

### Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/adamstirtan/evolutionary-neural-network-ants.git
   cd evolutionary-neural-network-ants
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Or using Python 2
   python -m SimpleHTTPServer 8080
   
   # Or using Node.js
   npx http-server -p 8080
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

4. Watch the ants learn! Click on the canvas to add more food.

### Using p5.js Web Editor

1. Go to [editor.p5js.org](https://editor.p5js.org)
2. Copy the contents of `index.html` and paste it into the editor
3. Press **▶️ Run** to start the simulation

## 🧠 How It Works

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
- Both teams spawn in new random positions
- More food is added to the environment

### Genetic Algorithm (GA)

The red ants evolve using these steps:

1. **Fitness Evaluation:** Score based on food collected
2. **Selection:** Tournament selection (best of 3 random ants)
3. **Crossover:** Single-point crossover between parent weights
4. **Mutation:** Gaussian noise applied to weights
5. **Elitism:** Best ant always survives to next generation

### Particle Swarm Optimization (PSO)

The blue ants optimize using swarm intelligence:

1. **Fitness Evaluation:** Score based on food collected
2. **Personal Best:** Each ant tracks its best weight configuration
3. **Global Best:** Track the best weights across all ants
4. **Velocity Update:** 
   ```
   v = w*v + c1*r1*(pBest - x) + c2*r2*(gBest - x)
   ```
5. **Position Update:** Apply velocity to weights

## 🎮 Interactive Controls

### Canvas Interaction
- **Click anywhere** on the canvas to spawn new food

### GA Parameters
- **Mutation Rate:** Controls how much random variation is added (0.01 - 0.5)
- **Crossover Rate:** Probability of combining two parents (0.5 - 1.0)

### PSO Parameters
- **Inertia Weight:** How much previous velocity influences movement (0.4 - 0.9)
- **Cognitive Weight:** Attraction to personal best position (0.5 - 2.5)
- **Social Weight:** Attraction to global best position (0.5 - 2.5)

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
│   ├── neural.js      # Neural network implementation
│   ├── ga.js          # Genetic Algorithm implementation
│   └── pso.js         # Particle Swarm Optimization implementation
├── README.md          # This file
└── LICENSE            # MIT License
```

## 🔬 Learning Outcomes

This simulation demonstrates:

1. **Neural networks can be trained without gradients** - Both GA and PSO successfully optimize network weights through evolutionary processes
2. **Emergent behavior** - Simple rules at the individual level lead to complex foraging behaviors at the colony level
3. **Algorithm comparison** - Observe how different optimization strategies perform on the same task
4. **Hyperparameter impact** - Adjust sliders to see how parameters affect learning speed and quality

## 📊 Observing Learning

Watch for these patterns as generations progress:

- **Early generations:** Ants move randomly, rarely finding food
- **Middle generations:** Ants start to move toward nearby food more consistently
- **Later generations:** Ants efficiently navigate to food sources

Compare the two teams:
- **GA** tends to have more diversity but can be slower to converge
- **PSO** often converges faster but may get stuck in local optima

## 🎯 Future Enhancements

Potential improvements and extensions:

- [ ] Add obstacles that ants must navigate around
- [ ] Implement pheromone trails for communication
- [ ] Add predators or competing objectives
- [ ] Visualize neural network weights in real-time
- [ ] Save/load best-performing ant brains
- [ ] Add more advanced neural architectures
- [ ] Implement additional evolutionary algorithms (CMA-ES, Neuroevolution, etc.)
- [ ] Add performance graphs over time

## 💡 Why This Project Exists

When teaching about neural networks, students often learn **backpropagation** as the only training method.  
This project demonstrates that **evolutionary computation** — through GA or PSO — can also discover effective network weights, even when gradients are unavailable or non-differentiable.

It's a fun way to explore **AI without calculus**, and a great foundation for learning about:

- Emergent behavior in agent-based systems
- Alternative optimization strategies
- Interactive, visual AI experiments
- The connection between biology and machine learning

## 🧰 Tech Stack

- **JavaScript** - Core programming language
- **p5.js** - Graphics and animation library
- **HTML/CSS** - User interface and styling

No build tools or dependencies required! Just open in a browser.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs or request features via GitHub Issues
- Submit pull requests with improvements
- Share your own experiments and modifications

## 🙏 Acknowledgments

This project was inspired by:

- Research in neuroevolution and evolutionary computation
- The p5.js creative coding community
- Educational demonstrations of alternative ML training methods
- Nature's own optimization algorithms (ant colonies, bird flocks, etc.)

## 📚 Further Reading

- [Genetic Algorithms in Neural Network Training](https://en.wikipedia.org/wiki/Neuroevolution)
- [Particle Swarm Optimization](https://en.wikipedia.org/wiki/Particle_swarm_optimization)
- [p5.js Documentation](https://p5js.org/reference/)
- [Evolutionary Computation: A Unified Approach](https://mitpress.mit.edu/books/evolutionary-computation)

---

**Enjoy watching the ants learn! 🐜🧠**
