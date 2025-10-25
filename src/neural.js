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
}
