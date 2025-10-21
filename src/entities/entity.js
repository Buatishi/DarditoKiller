
export class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, health = 100) {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.health = health;
        this.maxHealth = health;
        this.alive = true;
        
        this.setCollideWorldBounds(true);
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }
    
    die() {
        this.alive = false;
        this.destroy();
    }
}