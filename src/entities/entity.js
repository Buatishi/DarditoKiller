// CLASE BASE ENTITY
// Esta es la clase padre de la que heredan Player y Enemy
// Contiene las propiedades y métodos comunes a ambos

export class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, health = 100) {
        super(scene, x, y, texture);
        
        // Agregar el sprite a la escena y activar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propiedades básicas de vida
        this.health = health;
        this.maxHealth = health;
        this.alive = true;
        
        // No puede salir del mundo
        this.setCollideWorldBounds(true);
    }
    
    // Método para recibir daño
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }
    
    // Método para curar
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    // Método para morir
    die() {
        this.alive = false;
        this.destroy();
    }
}