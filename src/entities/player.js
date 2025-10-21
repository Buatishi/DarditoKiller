//maneja todo lo relacionado con el jugador: movimiento, ataque, inventario

import { Entity } from './entity.js';

export class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'jugador', 100);
        
        this.setDisplaySize(80, 80);
        
        this.speed = 200;
        
        this.damage = 20;
        this.attackRange = 125; 
        this.attackCooldown = 500; 
        this.canAttack = true;
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        scene.input.keyboard.on('keydown-Z', () => {
            this.attack();
        });
        
        this.coins = 0;
        this.inventory = [];
    }
    
    update() {
        if (!this.alive) return;
        
        this.handleMovement();
    }
    
    handleMovement() {
        this.setVelocity(0);
        
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
        }
        if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.flipX = false;
        }
        if (this.cursors.up.isDown) {
            this.setVelocityY(-this.speed);
        }
        if (this.cursors.down.isDown) {
            this.setVelocityY(this.speed);
        }
    }
    
    attack() {
        if (!this.canAttack || !this.alive) return;
        
        this.scene.events.emit('playerAttack', {
            x: this.x,
            y: this.y,
            range: this.attackRange,
            damage: this.damage
        });
        
        this.canAttack = false;
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.canAttack = true;
        });
        
        this.showAttackAnimation();
    }
    
    showAttackAnimation() {
        //animacion de ataque 
        const attackCircle = this.scene.add.circle(
            this.x, 
            this.y, 
            this.attackRange, 
            0xff0000, 
            0.3
        );
        
        //sacar circulo
        this.scene.tweens.add({
            targets: attackCircle,
            alpha: 0,
            duration: 200,
            onComplete: () => attackCircle.destroy()
        });
    }
    
    addCoins(amount) {
        this.coins += amount;
    }
    
    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            return true;
        }
        return false;
    }
    
    die() {
        super.die();
        this.scene.events.emit('playerDied');
    }
}