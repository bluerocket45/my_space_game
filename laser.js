class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 1, 
      key: 'laser',
      active: false,
      visible: false,
      x: -100,
      y: -100
    });
  }
}

function fireLaser(laserGroup, player) {
  let laser = laserGroup.getFirstDead(false);
  if (laser) {
    laser.setActive(true);
    laser.setVisible(true);
    laser.body.enable = true; // Enable the laser's body
    laser.setPosition(player.x + 20, player.y); 
    laser.setVelocityY(-500);
  }
}

function checkOutOfBounds(laserGroup) {
  laserGroup.children.iterate(function(laser) {
    if (laser.y < 0) {
      laser.setActive(false);
      laser.setVisible(false);
      laser.disableBody(true, true);
      laser.setVelocityY(0);
    }
  });
}