import Key from "./input.js";

export default class Game {

  constructor() {
    this.key = new Key();
    this.BOX_LIMITS = {
      TOP: 5,
      BOTTOM: -5,
      FRONT: 10,
      BACK: -10,
      LEFT: -5,
      RIGHT: 5 
    }

    this.isPaused = false;

    this.playerScore = 0;
    this.playerPosition = [0,0,10];

    this.aiScore = 0;
    this.aiPosition = [0,0,-10];
    this.aiDifficulty = 0.2;

    this.ballPosition = [0,0,0];
    this.ballVelocity = [0,0,0];

    this.speedIncreasement = 0.01;

    this.restartBall();
  }

  pause() {
    this.isPaused = !this.isPaused;
  }

  restartBall() {
    this.ballPosition = [0,0,0];
    let vx = Math.random();
    let vy = Math.random();
    let vz = Math.random();
    let norm = vx + vy + vz;
    if(this.playerScore > this.aiScore) {
      this.ballVelocity = [vx/norm/10, vy/norm/10, 0.05];
    }
    else {
      this.ballVelocity = [vx/norm/10, vy/norm/10, -0.05];
    }
  }

  update() {
    if(!this.isPaused) {
      this.movePlayer();
      this.moveBall();
      this.moveAI();
    }

    if(this.playerScore == 8 || this.aiScore == 8) {
      this.isPaused = false;

      this.playerScore = 0;
      this.playerPosition = [0,0,10];
  
      this.aiScore = 0;
      this.aiPosition = [0,0,-10];
      this.aiDifficulty = 0.2;
  
      this.ballPosition = [0,0,0];
      this.ballVelocity = [0,0,0];
  
      this.speedIncreasement = 0.01;
  
      this.restartBall();

    }
  }

  movePlayer() {
    if (this.key.isDown(this.key.UP) || this.key.isDown(this.key.W))
      this.playerPosition[1] = Math.min(this.playerPosition[1]+0.1, this.BOX_LIMITS.TOP - 0.5);
    if (this.key.isDown(this.key.DOWN) || this.key.isDown(this.key.S))
      this.playerPosition[1] = Math.max(this.playerPosition[1]-0.1, this.BOX_LIMITS.BOTTOM + 0.5);
    if(this.key.isDown(this.key.LEFT) || this.key.isDown(this.key.A))
      this.playerPosition[0] = Math.max(this.playerPosition[0]-0.1, this.BOX_LIMITS.LEFT + 0.5);
    if(this.key.isDown(this.key.RIGHT) || this.key.isDown(this.key.D))
      this.playerPosition[0] = Math.min(this.playerPosition[0]+0.1, this.BOX_LIMITS.RIGHT - 0.5);
  }

  moveAI() {
    let probability = Math.random();

    if(probability < this.aiDifficulty) {
      if(this.ballPosition[0] > this.aiPosition[0])
        this.aiPosition[0] = Math.min(this.aiPosition[0]+0.1, this.BOX_LIMITS.RIGHT - 0.5);
      else if(this.ballPosition[0] < this.aiPosition[0])
        this.aiPosition[0] = Math.max(this.aiPosition[0]-0.1, this.BOX_LIMITS.LEFT + 0.5);

      if(this.ballPosition[1] > this.aiPosition[1])
        this.aiPosition[1] = Math.min(this.aiPosition[1]+0.1, this.BOX_LIMITS.TOP - 0.5);
      else if(this.ballPosition[1] < this.aiPosition[1])
        this.aiPosition[1] = Math.max(this.aiPosition[1]-0.1, this.BOX_LIMITS.BOTTOM + 0.5);
    }
  }

  moveBall() {
    let potentialPosition = [0,0,0];
    vec3.add(potentialPosition, this.ballPosition, this.ballVelocity);

    // Si choca en la derecha o izquierda
    if (potentialPosition[0] >= this.BOX_LIMITS.RIGHT -0.125) {
      potentialPosition[0] = this.BOX_LIMITS.RIGHT -0.125;
      this.ballVelocity[0] = -this.ballVelocity[0];
    }
    else if (potentialPosition[0] <= this.BOX_LIMITS.LEFT + 0.125) {
      potentialPosition[0] = this.BOX_LIMITS.LEFT + 0.125;
      this.ballVelocity[0] = -this.ballVelocity[0];
    }

    // Si choca arriba o abajo
    if (potentialPosition[1] >= this.BOX_LIMITS.TOP - 0.125) {
      potentialPosition[1] = this.BOX_LIMITS.TOP - 0.125;
      this.ballVelocity[1] = -this.ballVelocity[1];
    }
    else if (potentialPosition[1] <= this.BOX_LIMITS.BOTTOM + 0.125) {
      potentialPosition[1] = this.BOX_LIMITS.BOTTOM + 0.125
      this.ballVelocity[1] = -this.ballVelocity[1];
    }
    
    // Si choca al frente o atras
    if (potentialPosition[2] >= this.BOX_LIMITS.FRONT - 0.125) {
      let deltaX = Math.abs(Math.abs(potentialPosition[0]) - Math.abs(this.playerPosition[0]));
      let deltaY = Math.abs(Math.abs(potentialPosition[1]) - Math.abs(this.playerPosition[1]));
      
      // Si el jugador la atrapa
      if (deltaX <= 0.5  &&  deltaY <= 0.5) {
        potentialPosition[2] = this.BOX_LIMITS.FRONT - 0.125;
        this.ballVelocity[2] = -this.ballVelocity[2] - this.speedIncreasement;
      }
      else {
        this.restartBall();
        potentialPosition = [0,0,0];
        this.aiScore++;
        
      }
    }
    else if (potentialPosition[2] <= this.BOX_LIMITS.BACK + 0.125) {
      let deltaX = Math.abs(Math.abs(potentialPosition[0]) - Math.abs(this.aiPosition[0]));
      let deltaY = Math.abs(Math.abs(potentialPosition[1]) - Math.abs(this.aiPosition[1]));
      
      // Si el oponente la atrapa
      if (deltaX <= 0.5  &&  deltaY <= 0.5) {
        potentialPosition[2] = this.BOX_LIMITS.BACK + 0.125;
        this.ballVelocity[2] = - this.ballVelocity[2] - this.speedIncreasement;
      }
      else {
        this.restartBall();
        potentialPosition = [0,0,0];
        this.playerScore++;
        this.aiDifficulty += 0.05;
      }
    }

    this.ballPosition = potentialPosition;
  }

}