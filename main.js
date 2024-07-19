const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let playerSpeed = 200;
let laserGroup;
let enemyGroup;
let spacebar; // Add spacebar variable
let emitter;
let score = 0; // Initialize score
let scoreText; // Text object to display score
let lives = 3; // Initialize lives
let livesText; // Text object to display lives

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('laser', 'assets/laser.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');
}

function create() {
  player = this.physics.add.sprite(100, 650, 'player'); // Create player sprite
  player.setCollideWorldBounds(true); // Set bounds
  player.setOrigin(0, 0);

  cursors = this.input.keyboard.createCursorKeys(); // Create cursors object
  laserGroup = new LaserGroup(this);
  enemyGroup = new EnemyGroup(this);

  emitter = this.add.particles(0, 0, "explosion", {
    frame: ["red", "yellow", "green", "blue", "purple"],
    lifespan: 1000,
    speed: { min: 0, max: 100 },
    emitting: false
    // Add other properties if needed
  });

  enemyGroup.getChildren().forEach(enemy => {
    move(enemy, this);
  });

  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Add spacebar listener

  this.physics.add.overlap(enemyGroup, laserGroup, (enemy, laser) => {
    laserCollision(enemy, laser, this);
  });

  // Add collision detection between player and enemies
  this.physics.add.overlap(player, enemyGroup, (player, enemy) => {
    playerEnemyCollision(player, enemy, this);
  });

  // Initialize score and lives display
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#fff'
  });

  livesText = this.add.text(16, 50, 'Lives: 3', {
    fontSize: '32px',
    fill: '#fff'
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-playerSpeed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(playerSpeed);
  } else {
    player.setVelocityX(0);
  }

  if (Phaser.Input.Keyboard.JustDown(spacebar) && lives >= 1) { // Check if spacebar is pressed
    fireLaser(laserGroup, player); // Fire the laser
  }
  checkOutOfBounds(laserGroup, this);

  enemyGroup.children.iterate((enemy) => {
    // Check if enemy reaches the bottom
    checkEnemyPosition(enemy, this);
  });
}

function laserCollision(enemy, laser, scene) {
  if (enemy.y > 10) {
    emitter.explode(40, enemy.x, enemy.y);
    score += 10; // Adjust score increment as needed
    scoreText.setText('Score: ' + score);
  }
  laser.setActive(false);
  laser.setVisible(false);
  laser.disableBody(true, true); // Disables both the body and removes from physics world
  move(enemy, scene);

  // Increase score and update scoreText
}

function playerEnemyCollision(player, enemy, scene) {
  // Call the move function on each enemy in the enemyGroup
  enemyGroup.getChildren().forEach(e => {
    move(e, scene);
  });

  // Decrease lives and update livesText
  lives -= 1;
  livesText.setText('Lives: ' + lives);

  if (lives <= 0) {
    // Show "Game Over!" text
    const gameOverText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Game Over!', {
      fontSize: '64px',
      fill: '#fff'
    }).setOrigin(0.5, 0.5);

    // Make player invisible and inactive
    player.setVisible(false);
    player.setActive(false);

    // Disable player physics
    player.body.enable = false;
  }
}