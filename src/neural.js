/**
 * Simple feedforward neural network for ant brain
 * 
 * Architecture:
 * - Input layer: 5 neurons (food angle, food distance, velocity x, velocity y, bias)
 * - Hidden layer: 4 neurons
 * - Output layer: 2 neurons (turn angle, speed)
 */

class NeuralNetwork {
    constructor(weights = null) {
        this.inputSize = 5;
        this.hiddenSize = 4;
        this.outputSize = 2;
        
        if (weights) {
            this.weights = weights;
        } else {
            this.weights = this.initializeWeights();
        }
    }
    
    /**
     * Initialize random weights for the network
     * Returns a flattened array of all weights
     */
    initializeWeights() {
        const weights = [];
        
        // Weights from input to hidden layer
        for (let i = 0; i < this.inputSize * this.hiddenSize; i++) {
            weights.push(Math.random() * 2 - 1); // Range: -1 to 1
        }
        
        // Weights from hidden to output layer
        for (let i = 0; i < this.hiddenSize * this.outputSize; i++) {
            weights.push(Math.random() * 2 - 1); // Range: -1 to 1
        }
        
        return weights;
    }
    
    /**
     * Activation function: tanh (smooth and bounded)
     */
    activate(x) {
        return Math.tanh(x);
    }
    
    /**
     * Forward propagation through the network
     * @param {Array} inputs - Array of input values [foodAngle, foodDist, velX, velY, bias]
     * @returns {Array} - Array of output values [turnAngle, speed]
     */
    predict(inputs) {
        // Ensure we have the right number of inputs
        if (inputs.length !== this.inputSize) {
            console.error('Invalid input size');
            return [0, 0.5];
        }
        
        // Calculate hidden layer activations
        const hidden = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputSize; j++) {
                const weightIndex = i * this.inputSize + j;
                sum += inputs[j] * this.weights[weightIndex];
            }
            hidden.push(this.activate(sum));
        }
        
        // Calculate output layer activations
        const outputs = [];
        const hiddenToOutputOffset = this.inputSize * this.hiddenSize;
        for (let i = 0; i < this.outputSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                const weightIndex = hiddenToOutputOffset + i * this.hiddenSize + j;
                sum += hidden[j] * this.weights[weightIndex];
            }
            outputs.push(this.activate(sum));
        }
        
        return outputs;
    }
    
    /**
     * Create a copy of this neural network
     */
    copy() {
        return new NeuralNetwork([...this.weights]);
    }
    
    /**
     * Get the total number of weights
     */
    getWeightCount() {
        return this.weights.length;
    }
    
    /**
     * Set weights from an array
     */
    setWeights(weights) {
        if (weights.length === this.weights.length) {
            this.weights = [...weights];
        }
    }
    
    /**
     * Get a copy of the weights
     */
    getWeights() {
        return [...this.weights];
    }
    
    /**
     * Backpropagation - update weights based on target outputs
     * This is a simplified version for reinforcement learning
     * @param {Array} inputs - Input values
     * @param {Array} targetOutputs - Target output values
     * @param {Number} rewardSignal - Reward signal (1 for good, -1 for bad)
     * @param {Number} learningRate - Learning rate
     */
    backpropagate(inputs, targetOutputs, rewardSignal, learningRate) {
        // Forward pass to get activations
        const hidden = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputSize; j++) {
                const weightIndex = i * this.inputSize + j;
                sum += inputs[j] * this.weights[weightIndex];
            }
            hidden.push(this.activate(sum));
        }
        
        const outputs = [];
        const hiddenToOutputOffset = this.inputSize * this.hiddenSize;
        for (let i = 0; i < this.outputSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                const weightIndex = hiddenToOutputOffset + i * this.hiddenSize + j;
                sum += hidden[j] * this.weights[weightIndex];
            }
            outputs.push(this.activate(sum));
        }
        
        // Backward pass - compute gradients
        // Output layer deltas (using reward-weighted error)
        const outputDeltas = [];
        for (let i = 0; i < this.outputSize; i++) {
            const error = (targetOutputs[i] - outputs[i]) * rewardSignal;
            // Derivative of tanh: 1 - tanh(x)^2
            const delta = error * (1 - outputs[i] * outputs[i]);
            outputDeltas.push(delta);
        }
        
        // Hidden layer deltas
        const hiddenDeltas = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let error = 0;
            for (let j = 0; j < this.outputSize; j++) {
                const weightIndex = hiddenToOutputOffset + j * this.hiddenSize + i;
                error += outputDeltas[j] * this.weights[weightIndex];
            }
            const delta = error * (1 - hidden[i] * hidden[i]);
            hiddenDeltas.push(delta);
        }
        
        // Update weights from hidden to output
        for (let i = 0; i < this.outputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                const weightIndex = hiddenToOutputOffset + i * this.hiddenSize + j;
                const gradient = outputDeltas[i] * hidden[j];
                this.weights[weightIndex] += learningRate * gradient;
                // Clamp weights
                this.weights[weightIndex] = constrain(this.weights[weightIndex], -2, 2);
            }
        }
        
        // Update weights from input to hidden
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.inputSize; j++) {
                const weightIndex = i * this.inputSize + j;
                const gradient = hiddenDeltas[i] * inputs[j];
                this.weights[weightIndex] += learningRate * gradient;
                // Clamp weights
                this.weights[weightIndex] = constrain(this.weights[weightIndex], -2, 2);
            }
        }
    }
}
