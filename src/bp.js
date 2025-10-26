/**
 * Backpropagation implementation for training ant neural networks
 * Uses gradient descent to optimize network weights based on reward signals
 */

class Backpropagation {
  constructor(populationSize = 20, learningRate = 0.01) {
    this.populationSize = populationSize;
    this.learningRate = learningRate;

    this.generation = 0;
    this.bestFitness = 0;
    this.avgFitness = 0;

    // Track accumulated gradients and experiences for each ant
    this.experiences = [];
  }

  /**
   * Update learning rate
   */
  setParameters(learningRate) {
    this.learningRate = learningRate;
  }

  /**
   * Initialize experience tracking for each ant
   */
  initialize(ants) {
    this.experiences = [];
    for (let i = 0; i < ants.length; i++) {
      this.experiences.push({
        states: [],
        actions: [],
        rewards: [],
        lastFitness: 0,
      });
    }
  }

  /**
   * Store experience for an ant during the episode
   */
  storeExperience(antIndex, state, action) {
    if (!this.experiences[antIndex]) return;
    this.experiences[antIndex].states.push(state);
    this.experiences[antIndex].actions.push(action);
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

      if (ant.fitness > maxFitness) {
        maxFitness = ant.fitness;
      }

      // Calculate reward for this generation (fitness improvement)
      if (this.experiences[i]) {
        const reward = ant.fitness - this.experiences[i].lastFitness;
        this.experiences[i].rewards.push(reward);
        this.experiences[i].lastFitness = ant.fitness;
      }
    }

    this.avgFitness = totalFitness / ants.length;
    this.bestFitness = maxFitness;
  }

  /**
   * Train a single ant's neural network using backpropagation
   * This is a simplified reward-based learning approach
   */
  trainAnt(ant, antIndex) {
    const experience = this.experiences[antIndex];
    if (!experience || experience.states.length === 0) return;

    // Calculate average reward for this episode
    const avgReward =
      experience.rewards.reduce((sum, r) => sum + r, 0) /
      Math.max(1, experience.rewards.length);

    // Only train if we have meaningful experiences
    if (experience.states.length > 0) {
      // Use REINFORCE-style gradient estimation
      // For each state-action pair, adjust weights to maximize reward
      for (let i = 0; i < Math.min(experience.states.length, 100); i++) {
        const state = experience.states[i];
        const action = experience.actions[i];

        // Compute gradients and update weights
        // We use a simple approach: if reward is positive, reinforce the action
        // if negative, discourage it
        const rewardSignal = avgReward > 0 ? 1 : -1;

        // Perform one backpropagation step
        ant.brain.backpropagate(state, action, rewardSignal, this.learningRate);
      }
    }

    // Clear experiences for next episode
    experience.states = [];
    experience.actions = [];
    experience.rewards = [];
  }

  /**
   * Evolve the population using backpropagation
   */
  evolve(ants, canvasWidth, canvasHeight) {
    // Initialize if this is the first generation
    if (this.experiences.length === 0) {
      this.initialize(ants);
    }

    // Evaluate current population
    this.evaluatePopulation(ants);

    // Train each ant's network
    for (let i = 0; i < ants.length; i++) {
      this.trainAnt(ants[i], i);
    }

    // Create new generation (keep same ants but respawn positions)
    const newAnts = [];
    for (let i = 0; i < ants.length; i++) {
      const ant = ants[i];
      const newAnt = new Ant(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight,
        "bp",
        ant.brain.copy()
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
