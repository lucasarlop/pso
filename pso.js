class Particle {

  constructor(position, speed) {
    this.position = position;
    this.speed    = speed;
    this.fitness  = null;

    this.updateFitness();

    this.bestPosition = this.position;
    this.bestFitness = this.fitness;
  }

  // (!) This function need to be adaptated according to the problem (!)
  updateFitness() {
    // f(x, y) = x² - xy  + y²  - 3y
    this.fitness = this.position[0]*this.position[0] - this.position[0]*this.position[1] + this.position[1]*this.position[1] - 3*this.position[1];
  }

  // (!) This function need to be adaptated according to the problem, for example: min or max (!)
  updateBestPosition() {
    if (this.bestFitness > this.fitness ) {
      this.bestPosition = this.position;
      this.bestFitness  = this.bestFitness;
    }
  }

  updateSpeed(bestParticle, COG_COMP, SOC_COMP, SPD_RESTRICTIONS) {
    var newSpeed;
    for (var i=0; i<this.speed.length-1; i++) {
      newSpeed = this.speed[i] + COG_COMP * (this.bestPosition[i] - this.position[i]) + SOC_COMP * (bestParticle.position[i] - this.position[i]);
      if (newSpeed < SPD_RESTRICTIONS[i][0]) {
        newSpeed = SPD_RESTRICTIONS[i][0];
      }
      if (newSpeed > SPD_RESTRICTIONS[i][1]) {
        newSpeed = SPD_RESTRICTIONS[i][1];
      }
      this.speed[i] = newSpeed;
    }
  }

  updatePosition(POS_RESTRICTIONS) {
    var newPosition;
    for (var i=0; i<this.position.length-1; i++) {
      newPosition = this.position[i] + this.speed[i];
      if (newPosition < POS_RESTRICTIONS[i][0]) {
        newPosition = POS_RESTRICTIONS[i][0];
      }
      if (newPosition > POS_RESTRICTIONS[i][1]) {
        newPosition = POS_RESTRICTIONS[i][1];
      }
      this.position[i] = newPosition;
    }
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function findBestParticle(particles) {
  var bestParticle = particles[0];
  for (var i=1; i<particles.length-1; i++) {
    if (particles[i].fitness < bestParticle.fitness) {
      bestParticle = particles[i];
    }
  }
  return bestParticle;
}

function pso() {
  // Let's find the mininum for f(x, y) = x² - xy  + y²  - 3y,
  //                            with: -5 <= x <= 5;
  //                                  -4 <= y <= 8.


  // Constants for PSO
  const U = 100; // points for discretization
  const P = 500; // number of particles
  const D = 2;   // number of dimensions
  const COG_COMP = 2;
  const SOC_COMP = 2;
  const MAX_EPOCHS = 100;


  // Problem's restrictions
  // Access[dimension][0] for min, [dimension][1] for max
  const POS_RESTRICTIONS = [
    [-5, 5],
    [-4, 8]
  ];

  const SPD_RESTRICTIONS = [
    [((POS_RESTRICTIONS[0][0] - POS_RESTRICTIONS[0][1]) / U), ((POS_RESTRICTIONS[0][1] - POS_RESTRICTIONS[0][0]) / U)],
    [((POS_RESTRICTIONS[1][0] - POS_RESTRICTIONS[1][1]) / U), ((POS_RESTRICTIONS[1][1] - POS_RESTRICTIONS[1][0]) / U)]
  ];

  // PSO variables
  var particles = new Array(); // population
  var randomPosition;
  var randomSpeed;
  var bestParticle;
  var t = 0;


  // PSO Canvas
  var stage      = new createjs.Stage("psoCanvas");
  var cParticles = new Array();
  var cParticle;

  const CANVAS_CENTER = [stage.canvas.width/2, stage.canvas.height/2];
  const SCALE_FACTOR_X_AXIS = 90;
  const SCALE_FACTOR_Y_AXIS = 5;
  const ANIMATION_SPEED = 50;

  // PSO Algorithm

  // starting particle's at random position
  for (var j=0; j<P; j++) {
    randomPosition = new Array();
    randomSpeed    = new Array();

    // for each dimension
    for (var k=0; k<D; k++) {
      randomPosition.push(randomBetween(POS_RESTRICTIONS[k][0], POS_RESTRICTIONS[k][1]));
      randomSpeed.push(randomBetween(SPD_RESTRICTIONS[k][0], SPD_RESTRICTIONS[k][1]));
    }

    particles[j]  = new Particle(randomPosition, randomSpeed);
    cParticles[j] = new createjs.Shape();
    cParticles[j].graphics.beginFill("DeepSkyBlue").drawCircle(CANVAS_CENTER[0], CANVAS_CENTER[1], 2);
    cParticles[j].x = particles[j].position[0] * SCALE_FACTOR_X_AXIS;
    cParticles[j].y = particles[j].position[1] * SCALE_FACTOR_Y_AXIS;
    stage.addChild(cParticles[j]);
  }

  // Center of Canvas
  cParticle = new createjs.Shape();
  cParticle.graphics.beginFill("Black").drawCircle(CANVAS_CENTER[0], CANVAS_CENTER[1], 2);
  cParticle.x = 0 * SCALE_FACTOR_X_AXIS;
  cParticle.y = 0 * SCALE_FACTOR_Y_AXIS;
  stage.addChild(cParticle);

  // Best Solution for this example
  cParticle = new createjs.Shape();
  cParticle.graphics.beginFill("Green").drawCircle(CANVAS_CENTER[0], CANVAS_CENTER[1], 4);
  cParticle.x = 1 * SCALE_FACTOR_X_AXIS;
  cParticle.y = 2 * SCALE_FACTOR_Y_AXIS;
  stage.addChild(cParticle);

  createjs.Ticker.addEventListener("tick", tick);

  function tick() {

    for (var i=0; i<P; i++) {
      cParticles[i].x = particles[i].position[0] * SCALE_FACTOR_X_AXIS;
      cParticles[i].y = particles[i].position[1] * SCALE_FACTOR_X_AXIS;
    }

    stage.update();
    console.log("ticking");
  }

  var counter = 0;
  function f() {
    document.getElementById("epoch").innerHTML = "Epoch: " + (counter) + "\n"
    for (var j=0; j<P; j++) {
      particles[j].updateFitness();
      particles[j].updateBestPosition();
      // console.log("Particle " + j + ": " + particles[j].fitness + " [" + particles[j].position[0] + ", " + particles[j].position[1] + "]");
    }

    bestParticle = findBestParticle(particles);
    // console.log("\nBest Particle: " + bestParticle.fitness + " [" + bestParticle.position[0] + ", " + bestParticle.position[1] + "]\n\n");

    for (var j=0; j<P; j++) {
      particles[j].updateSpeed(bestParticle, COG_COMP, SOC_COMP, SPD_RESTRICTIONS);
      particles[j].updatePosition(POS_RESTRICTIONS);

      // console.log("Particle " + j + ": " + particles[j].fitness + " [" + particles[j].position[0] + ", " + particles[j].position[1] + "]");
    }

    counter++;
    if (counter < MAX_EPOCHS) {
        setTimeout(f, ANIMATION_SPEED);
    }

    console.log("Best Particle " + j + ": " + bestParticle.fitness + " [" + bestParticle.position[0] + ", " + bestParticle.position[1] + "]");
  }
  f();
}
