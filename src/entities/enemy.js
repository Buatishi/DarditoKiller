// CLASE ENEMY
// Maneja los enemigos individuales y el sistema de spawn

import { Entity } from './entity.js';

export class Enemy extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemigo', 30);
        
        this.setDisplaySize(60, 60);
        
        // Stats del enemigo
        this.speed = 50;
        this.damage = 10;
        this.coinReward = 5;
        
        // Referencia al jugador para perseguirlo
        this.player = null;
    }
    
    // Asignar objetivo a perseguir
    setTarget(player) {
        this.player = player;
    }
    
    // Se llama cada frame
    update() {
        if (!this.alive || !this.player || !this.player.alive) return;
        
        // Perseguir al jugador
        this.scene.physics.moveToObject(this, this.player, this.speed);
    }
    
    // Override de die para dar recompensa
    die() {
        this.scene.events.emit('enemyKilled', this.coinReward);
        super.die();
    }
}

// ENEMY MANAGER
// Controla la creación y actualización de todos los enemigos

export class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.player = null;
        this.spawnTimer = null;
    }
    
    // Iniciar spawn automático de enemigos
    startSpawning() {
        this.spawnTimer = this.scene.time.addEvent({
            delay: 2000, // Cada 2 segundos
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }
    
    // Detener spawn
    stopSpawning() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
    }
    
    // Crear un nuevo enemigo
    spawnEnemy() {
        // Spawn en posiciones aleatorias de los bordes
        const side = Phaser.Math.Between(0, 3);
        let x, y;
        
        switch(side) {
            case 0: x = Phaser.Math.Between(0, 800); y = 0; break;      // Arriba
            case 1: x = 800; y = Phaser.Math.Between(0, 600); break;    // Derecha
            case 2: x = Phaser.Math.Between(0, 800); y = 600; break;    // Abajo
            case 3: x = 0; y = Phaser.Math.Between(0, 600); break;      // Izquierda
        }
        
        const enemy = new Enemy(this.scene, x, y);
        
        // Asignarle el jugador como objetivo
        if (this.player) {
            enemy.setTarget(this.player);
        }
        
        this.enemies.add(enemy);
        return enemy;
    }
    
    // Asignar jugador como objetivo de todos los enemigos
    setPlayer(player) {
        this.player = player;
        
        // Actualizar enemigos existentes
        this.enemies.children.entries.forEach(enemy => {
            enemy.setTarget(player);
        });
    }
    
    // Actualizar todos los enemigos cada frame
    updateAll() {
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.update) {
                enemy.update();
            }
        });
    }
    
    // Eliminar todos los enemigos
    clearAll() {
        this.enemies.clear(true, true);
    }
}