/**
 * Particle Swarm Optimization implementation for evolving ant neural networks
 */

class ParticleSwarmOptimization {
  constructor(
    populationSize = 20,
    inertiaWeight = 0.7,
    cognitiveWeight = 1.5,
    socialWeight = 1.5
  ) {
    this.populationSize = populationSize;
    this.inertiaWeight = inertiaWeight;
    this.cognitiveWeight = cognitiveWeight;
    this.socialWeight = socialWeight;

    this.generation = 0;
    this.bestFitness = 0;
    this.avgFitness = 0;

    // Track velocities and best positions for each particle
    this.velocities = [];
    this.personalBestWeights = [];
    this.personalBestFitness = [];
    this.globalBestWeights = null;
    // Use -Infinity so the very first evaluation always sets a meaningful baseline
    this.globalBestFitness = -Infinity;
  }

  /**
   * Update PSO parameters
   */
  setParameters(inertiaWeight, cognitiveWeight, socialWeight) {
    this.inertiaWeight = inertiaWeight;
    this.cognitiveWeight = cognitiveWeight;
    this.socialWeight = socialWeight;
  }

  /**
   * Initialize particle velocities and personal bests
   */
  initialize(ants) {
    this.velocities = [];
    this.personalBestWeights = [];
    this.personalBestFitness = [];

    for (let ant of ants) {
      const weightCount = ant.brain.getWeightCount();

      // Initialize velocity to zero
      const velocity = new Array(weightCount).fill(0);
      this.velocities.push(velocity);

      // Initialize personal best to current position
      this.personalBestWeights.push(ant.brain.getWeights());
      // Ensure any measured fitness (including 0) will become the new personal best on first eval
      this.personalBestFitness.push(-Infinity);
    }

    // Initialize global best
    // Defer to evaluatePopulation to set a proper global best based on fitness
    this.globalBestWeights = ants[0].brain.getWeights();
    this.globalBestFitness = -Infinity;
  }

  /**
   * Evaluate fitness statistics for the population
   */
  evaluatePopulation(ants) {
    let totalFitness = 0;
    let maxFitness = 0;

    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      totalFitness += ant.fitness;

      // Update personal best
      if (ant.fitness > this.personalBestFitness[i]) {
        this.personalBestFitness[i] = ant.fitness;
        this.personalBestWeights[i] = ant.brain.getWeights();
      }

      // Update global best
      if (ant.fitness > this.globalBestFitness) {
        this.globalBestFitness = ant.fitness;
        this.globalBestWeights = ant.brain.getWeights();
      }

      if (ant.fitness > maxFitness) {
        maxFitness = ant.fitness;
      }
    }

    this.avgFitness = totalFitness / ants.length;
    this.bestFitness = maxFitness;
  }

  /**
   * Update particle velocities and positions using PSO formula
   */
  updateParticle(particleIndex, currentWeights) {
    const velocity = this.velocities[particleIndex];
    const personalBest = this.personalBestWeights[particleIndex];
    const globalBest = this.globalBestWeights;

    const newWeights = [];

    for (let i = 0; i < currentWeights.length; i++) {
      // PSO velocity update formula:
      // v = w*v + c1*r1*(pBest - x) + c2*r2*(gBest - x)
      const inertia = this.inertiaWeight * velocity[i];
      const cognitive =
        this.cognitiveWeight *
        Math.random() *
        (personalBest[i] - currentWeights[i]);
      const social =
        this.socialWeight * Math.random() * (globalBest[i] - currentWeights[i]);

      const newVelocity = inertia + cognitive + social;

      // Clamp velocity to prevent explosion
      velocity[i] = constrain(newVelocity, -1, 1);

      // Update position (weights)
      let newWeight = currentWeights[i] + velocity[i];

      // Clamp weights to reasonable range
      newWeight = constrain(newWeight, -2, 2);
      newWeights.push(newWeight);
    }

    return newWeights;
  }

  /**
   * Evolve the population using PSO
   */
  evolve(ants, canvasWidth, canvasHeight) {
    // Initialize if this is the first generation
    if (this.velocities.length === 0) {
      this.initialize(ants);
    }

    // Evaluate current population
    this.evaluatePopulation(ants);

    // Update each particle
    const newAnts = [];

    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      const currentWeights = ant.brain.getWeights();

      // Update weights using PSO
      const newWeights = this.updateParticle(i, currentWeights);

      // Create new ant with updated weights
      const brain = new NeuralNetwork(newWeights);
      const newAnt = new Ant(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight,
        "pso",
        brain
      );
      newAnts.push(newAnt);
    }

    this.generation++;
    return newAnts;
  }

  /**
   * Get statistics for display
   */
  getStats() {
    return {
      generation: this.generation,
      bestFitness: Math.round(this.bestFitness * 10) / 10,
      avgFitness: Math.round(this.avgFitness * 10) / 10,
    };
  }
}
