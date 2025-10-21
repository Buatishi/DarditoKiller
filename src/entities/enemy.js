//maneja los enemigos y el spawn

import { Entity } from './entity.js';

export class Enemy extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemigo', 30);
        
        this.setDisplaySize(60, 60);
        
        this.speed = 50;
        this.damage = 10;
        this.coinReward = 5;
        this.health = 10
        
        this.player = null;
    }
    
    setTarget(player) {
        this.player = player;
    }
    
    update() {
        if (!this.alive || !this.player || !this.player.alive) return;
        
        this.scene.physics.moveToObject(this, this.player, this.speed);
    }
    
    die() {
        this.scene.events.emit('enemyKilled', this.coinReward);
        super.die();
    }
}


export class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.player = null;
        this.spawnTimer = null;
    }
    
    startSpawning() {
        this.spawnTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }
    
    stopSpawning() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
    }
    
    spawnEnemy() {
        const side = Phaser.Math.Between(0, 3);
        let x, y;
        
        switch(side) {
            case 0: x = Phaser.Math.Between(0, 800); y = 0; break;      
            case 1: x = 800; y = Phaser.Math.Between(0, 600); break;    
            case 2: x = Phaser.Math.Between(0, 800); y = 600; break;    
            case 3: x = 0; y = Phaser.Math.Between(0, 600); break;      
        }
        
        const enemy = new Enemy(this.scene, x, y);
        
        if (this.player) {
            enemy.setTarget(this.player);
        }
        
        this.enemies.add(enemy);
        return enemy;
    }
    
    setPlayer(player) {
        this.player = player;
        
        this.enemies.children.entries.forEach(enemy => {
            enemy.setTarget(player);
        });
    }
    
    updateAll() {
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.update) {
                enemy.update();
            }
        });
    }
    
    clearAll() {
        this.enemies.clear(true, true);
    }
}