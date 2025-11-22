export class Entity extends Phaser.Physics.Arcade.Sprite {
  health;
  maxHealth;
  alive;

  constructor(scene, x, y, texture, health) {
    super(scene, x, y, texture || '__DEFAULT');

    this.maxHealth = health;
    this.health = health;
    this.alive = true;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    if (!texture) {
      this.setVisible(false);
    }
  }

  takeDamage(damage) {
    if (!this.alive) return;

    this.health -= damage;

    if (this.visible) {
      this.setTint(0xff0000);
      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      });
    }

    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  die() {
    this.alive = false;
    this.setVisible(false);
    this.setActive(false);
  }
}