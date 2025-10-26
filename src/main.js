/**
 * Main simulation file
 * Coordinates the entire ant simulation with GA and PSO
 */

// Simulation parameters (canvas size will be set dynamically)
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 800;
let populationSize = 30; // Per team (shared across GA/PSO/BP)
let generationTime = 600; // Frames (10 seconds at 60fps)
let foodPieces = 50; // Fixed target set by user; replenished only at generation end

// Global variables
let gaAnts = [];
let psoAnts = [];
let bpAnts = [];
let foods = [];
let gaAlgorithm;
let psoAlgorithm;
let bpAlgorithm;
let frameCounter = 0;
let isPaused = true; // Start paused to let the user set parameters, then press Start

// UI elements
let mutationRateSlider, crossoverRateSlider;
let inertiaWeightSlider, cognitiveWeightSlider, socialWeightSlider;
let learningRateSlider;
let generationLengthSlider;
let eliteCountSlider;
let populationSizeSlider;
let foodCountSlider;
let fitnessChart;
let fitnessChartAvg;

/**
 * p5.js setup function - runs once at start
 */
function setup() {
  // Determine available canvas size from container
  const container = document.getElementById("canvas-container");
  if (container) {
    const rect = container.getBoundingClientRect();
    CANVAS_WIDTH = Math.max(300, Math.floor(rect.width));
    CANVAS_HEIGHT = Math.max(300, Math.floor(rect.height));
  }
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("canvas-container");

  // Initialize algorithms
  gaAlgorithm = new GeneticAlgorithm(populationSize, 0.15, 0.9, 2);
  psoAlgorithm = new ParticleSwarmOptimization(populationSize, 0.7, 1.5, 1.5);
  bpAlgorithm = new Backpropagation(populationSize, 0.01);

  // Initialize populations
  initializePopulations();

  // Spawn initial food
  spawnFood(foodPieces);

  // Setup UI controls
  setupUIControls();

  // Initialize chart after controls
  initFitnessChart();
  // Seed initial point (generation 0)
  appendFitnessPoint();
}

/**
 * Initialize both ant populations
 */
function initializePopulations() {
  gaAnts = [];
  psoAnts = [];
  bpAnts = [];

  // Create GA ants (red team)
  for (let i = 0; i < populationSize; i++) {
    const ant = new Ant(Math.random() * width, Math.random() * height, "ga");
    gaAnts.push(ant);
  }

  // Create PSO ants (cyan team)
  for (let i = 0; i < populationSize; i++) {
    const ant = new Ant(Math.random() * width, Math.random() * height, "pso");
    psoAnts.push(ant);
  }

  // Create BP ants (yellow team)
  for (let i = 0; i < populationSize; i++) {
    const ant = new Ant(Math.random() * width, Math.random() * height, "bp");
    bpAnts.push(ant);
  }
}

/**
 * Spawn food at random locations
 */
function spawnFood(count) {
  for (let i = 0; i < count; i++) {
    const food = new Food(Math.random() * width, Math.random() * height);
    foods.push(food);
  }
}

/**
 * Setup UI controls and event listeners
 */
function setupUIControls() {
  // Mutation rate slider
  mutationRateSlider = select("#mutation-rate");
  mutationRateSlider.input(() => {
    select("#mutation-rate-value").html(mutationRateSlider.value());
    gaAlgorithm.setParameters(
      parseFloat(mutationRateSlider.value()),
      parseFloat(crossoverRateSlider.value()),
      eliteCountSlider
        ? parseInt(eliteCountSlider.value())
        : gaAlgorithm.eliteCount
    );
  });

  // Crossover rate slider
  crossoverRateSlider = select("#crossover-rate");
  crossoverRateSlider.input(() => {
    select("#crossover-rate-value").html(crossoverRateSlider.value());
    gaAlgorithm.setParameters(
      parseFloat(mutationRateSlider.value()),
      parseFloat(crossoverRateSlider.value()),
      eliteCountSlider
        ? parseInt(eliteCountSlider.value())
        : gaAlgorithm.eliteCount
    );
  });

  // GA elitism (elites 0..3)
  eliteCountSlider = select("#elite-count");
  if (eliteCountSlider) {
    eliteCountSlider.input(() => {
      const val = parseInt(eliteCountSlider.value());
      select("#elite-count-value").html(String(val));
      gaAlgorithm.setParameters(
        parseFloat(mutationRateSlider.value()),
        parseFloat(crossoverRateSlider.value()),
        val
      );
    });
  }

  // PSO parameters
  inertiaWeightSlider = select("#inertia-weight");
  inertiaWeightSlider.input(() => {
    select("#inertia-weight-value").html(inertiaWeightSlider.value());
    psoAlgorithm.setParameters(
      parseFloat(inertiaWeightSlider.value()),
      parseFloat(cognitiveWeightSlider.value()),
      parseFloat(socialWeightSlider.value())
    );
  });

  cognitiveWeightSlider = select("#cognitive-weight");
  cognitiveWeightSlider.input(() => {
    select("#cognitive-weight-value").html(cognitiveWeightSlider.value());
    psoAlgorithm.setParameters(
      parseFloat(inertiaWeightSlider.value()),
      parseFloat(cognitiveWeightSlider.value()),
      parseFloat(socialWeightSlider.value())
    );
  });

  socialWeightSlider = select("#social-weight");
  socialWeightSlider.input(() => {
    select("#social-weight-value").html(socialWeightSlider.value());
    psoAlgorithm.setParameters(
      parseFloat(inertiaWeightSlider.value()),
      parseFloat(cognitiveWeightSlider.value()),
      parseFloat(socialWeightSlider.value())
    );
  });

  // BP parameters
  learningRateSlider = select("#learning-rate");
  if (learningRateSlider) {
    learningRateSlider.input(() => {
      select("#learning-rate-value").html(learningRateSlider.value());
      bpAlgorithm.setParameters(parseFloat(learningRateSlider.value()));
    });
  }

  // Generation length (frames)
  generationLengthSlider = select("#generation-length");
  if (generationLengthSlider) {
    generationLengthSlider.input(() => {
      const val = parseInt(generationLengthSlider.value());
      generationTime = isNaN(val) ? 300 : val;
      select("#generation-length-value").html(String(generationTime));
    });
  }

  // Population size (applied on reset)
  populationSizeSlider = select("#population-size");
  if (populationSizeSlider) {
    populationSizeSlider.input(() => {
      const val = parseInt(populationSizeSlider.value());
      populationSize = isNaN(val) ? populationSize : val;
      select("#population-size-value").html(String(populationSize));
    });
  }

  // Food pieces (enforced as a cap and initial count)
  foodCountSlider = select("#food-count");
  if (foodCountSlider) {
    foodCountSlider.input(() => {
      const val = parseInt(foodCountSlider.value());
      foodPieces = isNaN(val) ? foodPieces : val;
      select("#food-count-value").html(String(foodPieces));
      // Do not add or remove food immediately; only replenish at generation end
    });
  }

  // Reset button with confirmation; pause first, then defer confirm so label updates first
  select("#reset-btn").mousePressed(() => {
    // Pause the simulation and update the pause button text immediately
    isPaused = true;
    const pauseBtn = select("#toggle-pause-btn");
    if (pauseBtn) pauseBtn.html("Start");

    // Defer blocking confirm to next tick to allow UI to paint updated label
    setTimeout(() => {
      const confirmed = confirm(
        "Reset the simulation? This will restart both populations, respawn food, and reset stats."
      );
      if (confirmed) {
        resetSimulation();
        // Keep paused after reset; user can press Resume
      }
    }, 0);
  });

  // Pause button
  select("#toggle-pause-btn").mousePressed(() => {
    isPaused = !isPaused;
    select("#toggle-pause-btn").html(isPaused ? "Resume" : "Pause");
  });
}

/**
 * Reset the entire simulation
 */
function resetSimulation() {
  gaAlgorithm = new GeneticAlgorithm(
    populationSize,
    parseFloat(mutationRateSlider.value()),
    parseFloat(crossoverRateSlider.value()),
    eliteCountSlider ? parseInt(eliteCountSlider.value()) : 1
  );
  psoAlgorithm = new ParticleSwarmOptimization(
    populationSize,
    parseFloat(inertiaWeightSlider.value()),
    parseFloat(cognitiveWeightSlider.value()),
    parseFloat(socialWeightSlider.value())
  );
  bpAlgorithm = new Backpropagation(
    populationSize,
    learningRateSlider ? parseFloat(learningRateSlider.value()) : 0.01
  );

  initializePopulations();
  foods = [];
  spawnFood(foodPieces);
  frameCounter = 0;

  // Clear the fitness chart and seed initial point again
  clearFitnessChart();
  appendFitnessPoint();
}

/**
 * p5.js draw function - runs every frame
 */
function draw() {
  // Solid black game background as requested
  background(0);

  if (!isPaused) {
    // Update all ants
    for (let ant of gaAnts) {
      ant.update(foods, width, height);
    }
    for (let ant of psoAnts) {
      ant.update(foods, width, height);
    }
    for (let i = 0; i < bpAnts.length; i++) {
      const ant = bpAnts[i];
      // Get inputs before update
      const nearestFood = ant.findNearestFood(foods);
      const inputs = ant.getInputs(nearestFood);

      // Update ant
      ant.update(foods, width, height);

      // Get outputs after update (what the network decided to do)
      const outputs = ant.brain.predict(inputs);

      // Store experience for backpropagation training
      bpAlgorithm.storeExperience(i, inputs, outputs);
    }

    // Increment frame counter
    frameCounter++;

    // Check if it's time for a new generation
    if (frameCounter >= generationTime) {
      evolvePopulations();
      frameCounter = 0;

      // Replenish food only at generation end up to the target count
      const toSpawn = Math.max(0, foodPieces - foods.length);
      if (toSpawn > 0) spawnFood(toSpawn);
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
  for (let ant of bpAnts) {
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
  gaAnts = gaAlgorithm.evolve(gaAnts, width, height);

  // Evolve PSO population
  psoAnts = psoAlgorithm.evolve(psoAnts, width, height);

  // Evolve BP population
  bpAnts = bpAlgorithm.evolve(bpAnts, width, height);

  // Update chart with new stats for this generation
  appendFitnessPoint();
}

/**
 * Update statistics display
 */
function updateStats() {
  const gaStats = gaAlgorithm.getStats();
  const psoStats = psoAlgorithm.getStats();
  const bpStats = bpAlgorithm.getStats();

  select("#ga-best").html(gaStats.bestFitness);
  select("#ga-avg").html(gaStats.avgFitness);

  select("#pso-best").html(psoStats.bestFitness);
  select("#pso-avg").html(psoStats.avgFitness);

  select("#bp-best").html(bpStats.bestFitness);
  select("#bp-avg").html(bpStats.avgFitness);
}

/**
 * Draw generation timer on canvas
 */
function drawGenerationTimer() {
  const progress = frameCounter / generationTime;
  // Update the Start/Pause button background to reflect generation progress
  const btnEl = document.getElementById("toggle-pause-btn");
  if (btnEl) {
    const clamped = Math.max(0, Math.min(1, progress));
    btnEl.style.setProperty("--progress", String(clamped));
    btnEl.setAttribute("aria-valuemin", "0");
    btnEl.setAttribute("aria-valuemax", "100");
    btnEl.setAttribute("aria-valuenow", String(Math.floor(clamped * 100)));
  }
}

/**
 * Clear the fitness chart (labels and datasets) and redraw empty chart
 */
function clearFitnessChart() {
  if (!fitnessChart) return;
  fitnessChart.data.labels = [];
  if (Array.isArray(fitnessChart.data.datasets)) {
    fitnessChart.data.datasets.forEach((ds) => {
      ds.data = [];
    });
  }
  fitnessChart.update("none");

  if (fitnessChartAvg) {
    fitnessChartAvg.data.labels = [];
    if (Array.isArray(fitnessChartAvg.data.datasets)) {
      fitnessChartAvg.data.datasets.forEach((ds) => {
        ds.data = [];
      });
    }
    fitnessChartAvg.update("none");
  }
}

/**
 * Handle mouse clicks to add food
 */
function mousePressed() {
  // Check if click is within canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    const food = new Food(mouseX, mouseY);
    foods.push(food);
  }
}

// (auto food scaling removed)

/**
 * Handle window resize to keep canvas full available area
 */
function windowResized() {
  const container = document.getElementById("canvas-container");
  if (container) {
    const rect = container.getBoundingClientRect();
    CANVAS_WIDTH = Math.max(300, Math.floor(rect.width));
    CANVAS_HEIGHT = Math.max(300, Math.floor(rect.height));
    resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // Clamp any off-screen foods back into bounds to keep things reachable
    for (let f of foods) {
      if (f.x < 0) f.x = 0;
      if (f.x > width) f.x = width - 1;
      if (f.y < 0) f.y = 0;
      if (f.y > height) f.y = height - 1;
    }
  }
}

// (auto food scaling removed)

/**
 * Initialize the fitness chart (Chart.js)
 */
function initFitnessChart() {
  const el = document.getElementById("fitness-chart");
  const elAvg = document.getElementById("fitness-chart-avg");
  if (!el || !elAvg || typeof Chart === "undefined") return;
  const ctx = el.getContext("2d");
  const ctxAvg = elAvg.getContext("2d");

  // Best-only chart
  fitnessChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "GA Best",
          data: [],
          borderColor: "rgb(255,107,107)",
          backgroundColor: "rgba(255,107,107,0.15)",
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "PSO Best",
          data: [],
          borderColor: "rgb(78,205,196)",
          backgroundColor: "rgba(78,205,196,0.15)",
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "BP Best",
          data: [],
          borderColor: "rgb(255,193,7)",
          backgroundColor: "rgba(255,193,7,0.15)",
          borderWidth: 2,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          title: { display: false },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#a7b1c2" },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#a7b1c2" },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#e7edf6", boxWidth: 12 },
        },
        tooltip: { enabled: true },
      },
      elements: { point: { radius: 0 } },
    },
  });

  // Avg-only chart
  fitnessChartAvg = new Chart(ctxAvg, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "GA Avg",
          data: [],
          borderColor: "rgba(255,107,107,0.9)",
          borderDash: [5, 4],
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "PSO Avg",
          data: [],
          borderColor: "rgba(78,205,196,0.9)",
          borderDash: [5, 4],
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "BP Avg",
          data: [],
          borderColor: "rgba(255,193,7,0.9)",
          borderDash: [5, 4],
          borderWidth: 2,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          title: { display: false },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#a7b1c2" },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#a7b1c2" },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#e7edf6", boxWidth: 12 },
        },
        tooltip: { enabled: true },
      },
      elements: { point: { radius: 0 } },
    },
  });
}

/**
 * Append current generation stats to the chart
 */
function appendFitnessPoint() {
  if (!fitnessChart) return;
  const gaStats = gaAlgorithm.getStats();
  const psoStats = psoAlgorithm.getStats();
  const bpStats = bpAlgorithm.getStats();
  const gen = gaAlgorithm.generation;
  fitnessChart.data.labels.push(gen);
  // Best-only chart: GA Best, PSO Best, BP Best
  fitnessChart.data.datasets[0].data.push(gaStats.bestFitness);
  fitnessChart.data.datasets[1].data.push(psoStats.bestFitness);
  fitnessChart.data.datasets[2].data.push(bpStats.bestFitness);
  fitnessChart.update("none");

  if (fitnessChartAvg) {
    fitnessChartAvg.data.labels.push(gen);
    // Avg-only chart: GA Avg, PSO Avg, BP Avg
    fitnessChartAvg.data.datasets[0].data.push(gaStats.avgFitness);
    fitnessChartAvg.data.datasets[1].data.push(psoStats.avgFitness);
    fitnessChartAvg.data.datasets[2].data.push(bpStats.avgFitness);
    fitnessChartAvg.update("none");
  }
}

// (auto food scaling removed)
