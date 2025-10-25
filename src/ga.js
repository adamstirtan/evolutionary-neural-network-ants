/**
 * Genetic Algorithm implementation for evolving ant neural networks
 */

class GeneticAlgorithm {
    constructor(populationSize = 20, mutationRate = 0.1, crossoverRate = 0.8) {
        this.populationSize = populationSize;
        this.mutationRate = mutationRate;
        this.crossoverRate = crossoverRate;
        this.generation = 0;
        this.bestFitness = 0;
        this.avgFitness = 0;
    }
    
    /**
     * Update mutation and crossover rates
     */
    setParameters(mutationRate, crossoverRate) {
        this.mutationRate = mutationRate;
        this.crossoverRate = crossoverRate;
    }
    
    /**
     * Evaluate fitness statistics for the population
     */
    evaluatePopulation(ants) {
        let totalFitness = 0;
        let maxFitness = 0;
        
        for (let ant of ants) {
            totalFitness += ant.fitness;
            if (ant.fitness > maxFitness) {
                maxFitness = ant.fitness;
            }
        }
        
        this.avgFitness = totalFitness / ants.length;
        this.bestFitness = maxFitness;
    }
    
    /**
     * Perform tournament selection
     * Select the best individual from a random subset
     */
    tournamentSelection(ants, tournamentSize = 3) {
        let best = null;
        
        for (let i = 0; i < tournamentSize; i++) {
            const candidate = random(ants);
            if (!best || candidate.fitness > best.fitness) {
                best = candidate;
            }
        }
        
        return best;
    }
    
    /**
     * Perform crossover between two parents
     * Use single-point crossover on the weights
     */
    crossover(parent1, parent2) {
        const weights1 = parent1.brain.getWeights();
        const weights2 = parent2.brain.getWeights();
        const childWeights = [];
        
        if (Math.random() < this.crossoverRate) {
            // Perform crossover
            const crossoverPoint = Math.floor(Math.random() * weights1.length);
            
            for (let i = 0; i < weights1.length; i++) {
                if (i < crossoverPoint) {
                    childWeights.push(weights1[i]);
                } else {
                    childWeights.push(weights2[i]);
                }
            }
        } else {
            // No crossover, just copy one parent
            childWeights.push(...weights1);
        }
        
        return childWeights;
    }
    
    /**
     * Mutate weights with Gaussian noise
     */
    mutate(weights) {
        const mutatedWeights = [];
        
        for (let i = 0; i < weights.length; i++) {
            if (Math.random() < this.mutationRate) {
                // Apply Gaussian mutation
                const mutation = randomGaussian(0, 0.3);
                let newWeight = weights[i] + mutation;
                // Clamp to reasonable range
                newWeight = constrain(newWeight, -2, 2);
                mutatedWeights.push(newWeight);
            } else {
                mutatedWeights.push(weights[i]);
            }
        }
        
        return mutatedWeights;
    }
    
    /**
     * Evolve the population to create the next generation
     */
    evolve(ants, canvasWidth, canvasHeight) {
        // Evaluate current population
        this.evaluatePopulation(ants);
        
        // Create new population
        const newAnts = [];
        
        // Elitism: keep the best ant
        let bestAnt = ants[0];
        for (let ant of ants) {
            if (ant.fitness > bestAnt.fitness) {
                bestAnt = ant;
            }
        }
        const eliteAnt = new Ant(
            Math.random() * canvasWidth,
            Math.random() * canvasHeight,
            'ga',
            bestAnt.brain.copy()
        );
        newAnts.push(eliteAnt);
        
        // Create rest of population through selection, crossover, and mutation
        while (newAnts.length < this.populationSize) {
            // Selection
            const parent1 = this.tournamentSelection(ants);
            const parent2 = this.tournamentSelection(ants);
            
            // Crossover
            const childWeights = this.crossover(parent1, parent2);
            
            // Mutation
            const mutatedWeights = this.mutate(childWeights);
            
            // Create new ant
            const brain = new NeuralNetwork(mutatedWeights);
            const newAnt = new Ant(
                Math.random() * canvasWidth,
                Math.random() * canvasHeight,
                'ga',
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
            avgFitness: Math.round(this.avgFitness * 10) / 10
        };
    }
}
