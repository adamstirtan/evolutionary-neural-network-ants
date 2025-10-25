/**
 * Ant class - represents an individual ant with a neural network brain
 */

class Ant {
  constructor(x, y, team, brain = null) {
    this.x = x;
    this.y = y;
    this.team = team; // 'ga' or 'pso'
    this.brain = brain || new NeuralNetwork();

    // Movement properties
    this.velocity = createVector(0, 0);
    this.angle = Math.random() * Math.PI * 2;
    this.maxSpeed = 2;
    this.maxForce = 0.1;

    // Size and appearance
    this.size = 6;
    this.color = team === "ga" ? color(255, 107, 107) : color(78, 205, 196);

    // Fitness tracking
    this.fitness = 0;
    this.foodCollected = 0;

    // Sensing radius
    this.senseRadius = 150;
  }

  /**
   * Update ant position and behavior
   */
  update(foods, width, height) {
    // Find nearest food
    const nearestFood = this.findNearestFood(foods);

    // Get neural network inputs
    const inputs = this.getInputs(nearestFood);

    // Get neural network outputs
    const outputs = this.brain.predict(inputs);

    // Apply outputs to movement
    // Output[0]: turn angle (-1 to 1) → map to -PI/4 to PI/4
    // Output[1]: speed (0 to 1) → map to 0 to maxSpeed
    const turnAngle = (outputs[0] * Math.PI) / 4;
    const speed = (outputs[1] + 1) / 2; // Map from [-1, 1] to [0, 1]

    // Update angle
    this.angle += turnAngle;

    // Update velocity based on angle and speed
    this.velocity.x = Math.cos(this.angle) * speed * this.maxSpeed;
    this.velocity.y = Math.sin(this.angle) * speed * this.maxSpeed;

    // Update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Wrap around edges
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;

    // Check for food collision
    this.checkFoodCollision(foods);
  }

  /**
   * Find the nearest food to this ant
   */
  findNearestFood(foods) {
    let nearest = null;
    let minDist = Infinity;

    for (let food of foods) {
      const d = dist(this.x, this.y, food.x, food.y);
      if (d < minDist) {
        minDist = d;
        nearest = food;
      }
    }

    return nearest;
  }

  /**
   * Get neural network inputs based on current state
   */
  getInputs(nearestFood) {
    let foodAngle = 0;
    let foodDist = 1; // Normalized distance

    if (nearestFood) {
      // Calculate angle to food relative to ant's heading
      const absoluteAngle = Math.atan2(
        nearestFood.y - this.y,
        nearestFood.x - this.x
      );
      foodAngle = absoluteAngle - this.angle;

      // Normalize angle to [-1, 1]
      while (foodAngle > Math.PI) foodAngle -= Math.PI * 2;
      while (foodAngle < -Math.PI) foodAngle += Math.PI * 2;
      foodAngle = foodAngle / Math.PI;

      // Calculate normalized distance
      const rawDist = dist(this.x, this.y, nearestFood.x, nearestFood.y);
      foodDist = Math.min(rawDist / this.senseRadius, 1);
    }

    // Return inputs: [foodAngle, foodDist, velocityX, velocityY, bias]
    return [
      foodAngle,
      foodDist,
      this.velocity.x / this.maxSpeed,
      this.velocity.y / this.maxSpeed,
      1.0, // bias
    ];
  }

  /**
   * Check if ant is colliding with any food
   */
  checkFoodCollision(foods) {
    for (let i = foods.length - 1; i >= 0; i--) {
      const food = foods[i];
      const d = dist(this.x, this.y, food.x, food.y);

      if (d < this.size + food.size) {
        // Collect food
        this.fitness += 10;
        this.foodCollected++;
        foods.splice(i, 1);
      }
    }
  }

  /**
   * Draw the ant
   */
  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Draw ant body
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.size * 2, this.size);

    // Draw direction indicator
    fill(255, 255, 255, 150);
    triangle(
      this.size,
      0,
      this.size / 2,
      this.size / 2,
      this.size / 2,
      -this.size / 2
    );

    pop();
  }

  /**
   * Reset fitness for new generation
   */
  resetFitness() {
    this.fitness = 0;
    this.foodCollected = 0;
  }

  /**
   * Create a copy of this ant
   */
  copy() {
    const newAnt = new Ant(this.x, this.y, this.team, this.brain.copy());
    newAnt.angle = this.angle;
    return newAnt;
  }
}

/**
 * Food class - represents a food source
 */
class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 8;
    this.color = color(76, 209, 55);
  }

  /**
   * Draw the food
   */
  draw() {
    push();
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size * 2);

    // Add a highlight
    fill(255, 255, 255, 100);
    ellipse(this.x - this.size / 2, this.y - this.size / 2, this.size);
    pop();
  }
}
