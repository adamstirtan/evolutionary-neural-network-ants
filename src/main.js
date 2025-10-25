/**
 * Main simulation file
 * Coordinates the entire ant simulation with GA and PSO
 */

// Simulation parameters
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const POPULATION_SIZE = 15; // Per team
const GENERATION_TIME = 300; // Frames (5 seconds at 60fps)
const INITIAL_FOOD_COUNT = 30;

// Global variables
let gaAnts = [];
let psoAnts = [];
let foods = [];
let gaAlgorithm;
let psoAlgorithm;
let frameCounter = 0;
let isPaused = false;

// UI elements
let mutationRateSlider, crossoverRateSlider;
let inertiaWeightSlider, cognitiveWeightSlider, socialWeightSlider;

/**
 * p5.js setup function - runs once at start
 */
function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    // Initialize algorithms
    gaAlgorithm = new GeneticAlgorithm(POPULATION_SIZE, 0.1, 0.8);
    psoAlgorithm = new ParticleSwarmOptimization(POPULATION_SIZE, 0.7, 1.5, 1.5);
    
    // Initialize populations
    initializePopulations();
    
    // Spawn initial food
    spawnFood(INITIAL_FOOD_COUNT);
    
    // Setup UI controls
    setupUIControls();
}

/**
 * Initialize both ant populations
 */
function initializePopulations() {
    gaAnts = [];
    psoAnts = [];
    
    // Create GA ants (red team)
    for (let i = 0; i < POPULATION_SIZE; i++) {
        const ant = new Ant(
            Math.random() * CANVAS_WIDTH,
            Math.random() * CANVAS_HEIGHT,
            'ga'
        );
        gaAnts.push(ant);
    }
    
    // Create PSO ants (blue team)
    for (let i = 0; i < POPULATION_SIZE; i++) {
        const ant = new Ant(
            Math.random() * CANVAS_WIDTH,
            Math.random() * CANVAS_HEIGHT,
            'pso'
        );
        psoAnts.push(ant);
    }
}

/**
 * Spawn food at random locations
 */
function spawnFood(count) {
    for (let i = 0; i < count; i++) {
        const food = new Food(
            Math.random() * CANVAS_WIDTH,
            Math.random() * CANVAS_HEIGHT
        );
        foods.push(food);
    }
}

/**
 * Setup UI controls and event listeners
 */
function setupUIControls() {
    // Mutation rate slider
    mutationRateSlider = select('#mutation-rate');
    mutationRateSlider.input(() => {
        select('#mutation-rate-value').html(mutationRateSlider.value());
        gaAlgorithm.setParameters(
            parseFloat(mutationRateSlider.value()),
            parseFloat(crossoverRateSlider.value())
        );
    });
    
    // Crossover rate slider
    crossoverRateSlider = select('#crossover-rate');
    crossoverRateSlider.input(() => {
        select('#crossover-rate-value').html(crossoverRateSlider.value());
        gaAlgorithm.setParameters(
            parseFloat(mutationRateSlider.value()),
            parseFloat(crossoverRateSlider.value())
        );
    });
    
    // PSO parameters
    inertiaWeightSlider = select('#inertia-weight');
    inertiaWeightSlider.input(() => {
        select('#inertia-weight-value').html(inertiaWeightSlider.value());
        psoAlgorithm.setParameters(
            parseFloat(inertiaWeightSlider.value()),
            parseFloat(cognitiveWeightSlider.value()),
            parseFloat(socialWeightSlider.value())
        );
    });
    
    cognitiveWeightSlider = select('#cognitive-weight');
    cognitiveWeightSlider.input(() => {
        select('#cognitive-weight-value').html(cognitiveWeightSlider.value());
        psoAlgorithm.setParameters(
            parseFloat(inertiaWeightSlider.value()),
            parseFloat(cognitiveWeightSlider.value()),
            parseFloat(socialWeightSlider.value())
        );
    });
    
    socialWeightSlider = select('#social-weight');
    socialWeightSlider.input(() => {
        select('#social-weight-value').html(socialWeightSlider.value());
        psoAlgorithm.setParameters(
            parseFloat(inertiaWeightSlider.value()),
            parseFloat(cognitiveWeightSlider.value()),
            parseFloat(socialWeightSlider.value())
        );
    });
    
    // Reset button
    select('#reset-btn').mousePressed(() => {
        resetSimulation();
    });
    
    // Pause button
    select('#toggle-pause-btn').mousePressed(() => {
        isPaused = !isPaused;
        select('#toggle-pause-btn').html(isPaused ? 'Resume' : 'Pause');
    });
}

/**
 * Reset the entire simulation
 */
function resetSimulation() {
    gaAlgorithm = new GeneticAlgorithm(
        POPULATION_SIZE,
        parseFloat(mutationRateSlider.value()),
        parseFloat(crossoverRateSlider.value())
    );
    psoAlgorithm = new ParticleSwarmOptimization(
        POPULATION_SIZE,
        parseFloat(inertiaWeightSlider.value()),
        parseFloat(cognitiveWeightSlider.value()),
        parseFloat(socialWeightSlider.value())
    );
    
    initializePopulations();
    foods = [];
    spawnFood(INITIAL_FOOD_COUNT);
    frameCounter = 0;
}

/**
 * p5.js draw function - runs every frame
 */
function draw() {
    background(26, 26, 46);
    
    if (!isPaused) {
        // Update all ants
        for (let ant of gaAnts) {
            ant.update(foods, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        for (let ant of psoAnts) {
            ant.update(foods, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        
        // Increment frame counter
        frameCounter++;
        
        // Check if it's time for a new generation
        if (frameCounter >= GENERATION_TIME) {
            evolvePopulations();
            frameCounter = 0;
            
            // Spawn more food for next generation
            spawnFood(10);
        }
        
        // Randomly spawn food occasionally
        if (Math.random() < 0.02 && foods.length < 50) {
            spawnFood(1);
        }
    }
    
    // Draw all food
    for (let food of foods) {
        food.draw();
    }
    
    // Draw all ants
    for (let ant of gaAnts) {
        ant.draw();
    }
    for (let ant of psoAnts) {
        ant.draw();
    }
    
    // Update UI stats
    updateStats();
    
    // Draw generation timer
    drawGenerationTimer();
}

/**
 * Evolve both populations
 */
function evolvePopulations() {
    // Evolve GA population
    gaAnts = gaAlgorithm.evolve(gaAnts, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Evolve PSO population
    psoAnts = psoAlgorithm.evolve(psoAnts, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Update statistics display
 */
function updateStats() {
    const gaStats = gaAlgorithm.getStats();
    const psoStats = psoAlgorithm.getStats();
    
    select('#ga-generation').html(gaStats.generation);
    select('#ga-best').html(gaStats.bestFitness);
    select('#ga-avg').html(gaStats.avgFitness);
    
    select('#pso-generation').html(psoStats.generation);
    select('#pso-best').html(psoStats.bestFitness);
    select('#pso-avg').html(psoStats.avgFitness);
}

/**
 * Draw generation timer on canvas
 */
function drawGenerationTimer() {
    const progress = frameCounter / GENERATION_TIME;
    const barWidth = CANVAS_WIDTH * 0.3;
    const barHeight = 20;
    const x = CANVAS_WIDTH / 2 - barWidth / 2;
    const y = 20;
    
    // Background
    fill(16, 33, 62);
    noStroke();
    rect(x, y, barWidth, barHeight, 5);
    
    // Progress bar
    fill(76, 209, 55);
    rect(x, y, barWidth * progress, barHeight, 5);
    
    // Text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(`Generation ${gaAlgorithm.generation} - ${Math.floor(progress * 100)}%`, CANVAS_WIDTH / 2, y + barHeight / 2);
}

/**
 * Handle mouse clicks to add food
 */
function mousePressed() {
    // Check if click is within canvas
    if (mouseX >= 0 && mouseX <= CANVAS_WIDTH && mouseY >= 0 && mouseY <= CANVAS_HEIGHT) {
        const food = new Food(mouseX, mouseY);
        foods.push(food);
    }
}
