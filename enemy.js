class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 20,
      key: 'enemy',
      active: false,
      visible: false,
      x: -100,
      y: -100
    });
  }
}

function move(enemy, scene) {
    const randomX = Math.random() * scene.game.config.width;
    const randomY = -50;
    enemy.setPosition(randomX, randomY);

    enemy.setActive(true);
    enemy.setVisible(true);

    const speed = 100;
    const directionX = Math.random() - 0.5;
    const directionY = Math.random() + 1;
    const velocityX = directionX * speed;
    const velocityY = directionY * speed;
    enemy.setVelocityX(velocityX) 
    enemy.setVelocityY(velocityY);
}

function checkEnemyPosition(enemy, scene) {
    if (enemy.y > scene.game.config.height+20 || enemy.x < -40 || enemy.x > scene.game.config.width+40) {
      move(enemy, scene);
    }
}
