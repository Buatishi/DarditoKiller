// CLASE PLAYER
// Maneja todo lo relacionado con el jugador: movimiento, ataque, inventario

import { Entity } from './entity.js';

export class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'jugador', 100);
        
        this.setDisplaySize(60, 60);
        
        // Velocidad de movimiento
        this.speed = 200;
        
        // Stats de combate
        this.damage = 20;
        this.attackRange = 80; // Rango de ataque
        this.attackCooldown = 500; // Milisegundos entre ataques
        this.canAttack = true;
        
        // Controles de teclado
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // Configurar ataque con click
        scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.attack();
            }
        });
        
        // Inventario y monedas
        this.coins = 0;
        this.inventory = [];
    }
    
    // Se llama cada frame
    update() {
        if (!this.alive) return;
        
        this.handleMovement();
    }
    
    // Manejo del movimiento con flechas
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
    
    // Sistema de ataque
    attack() {
        // Solo atacar si no está en cooldown
        if (!this.canAttack || !this.alive) return;
        
        // Emitir evento de ataque (la escena lo manejará)
        this.scene.events.emit('playerAttack', {
            x: this.x,
            y: this.y,
            range: this.attackRange,
            damage: this.damage
        });
        
        // Activar cooldown
        this.canAttack = false;
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.canAttack = true;
        });
        
        // Animación visual simple de ataque
        this.showAttackAnimation();
    }
    
    // Animación visual del ataque
    showAttackAnimation() {
        // Crear un círculo que representa el área de ataque
        const attackCircle = this.scene.add.circle(
            this.x, 
            this.y, 
            this.attackRange, 
            0xff0000, 
            0.3
        );
        
        // Hacer que desaparezca rápidamente
        this.scene.tweens.add({
            targets: attackCircle,
            alpha: 0,
            duration: 200,
            onComplete: () => attackCircle.destroy()
        });
    }
    
    // Métodos para monedas
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
    
    // Override del método die para emitir evento
    die() {
        super.die();
        this.scene.events.emit('playerDied');
    }
}