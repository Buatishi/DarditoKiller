// GAME SCENE
// Escena principal del juego donde sucede toda la acción

import { Player } from '../entities/player.js';
import { EnemyManager } from '../entities/enemy.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    // Cargar recursos
    preload() {
        this.load.image('fondo', './assets/scenes/pastito.jpg');
        this.load.image('jugador', './assets/entities/dardo.jpg');
        this.load.image('enemigo', './assets/entities/moni.jpg');
    }
    
    // Crear elementos del juego
    create() {
        // Fondo
        let bg = this.add.image(400, 300, 'fondo');
        bg.setDisplaySize(800, 600);
        
        // Crear jugador en el centro
        this.player = new Player(this, 400, 300);
        
        // Crear gestor de enemigos
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.setPlayer(this.player); // IMPORTANTE: asignar jugador
        this.enemyManager.startSpawning();
        
        // Configurar colisiones: jugador choca con enemigos
        this.physics.add.overlap(
            this.player,
            this.enemyManager.enemies,
            this.onPlayerHitEnemy,
            null,
            this
        );
        
        // Crear interfaz (vida, monedas)
        this.createUI();
        
        // Escuchar eventos
        this.events.on('playerDied', this.onPlayerDied, this);
        this.events.on('enemyKilled', this.onEnemyKilled, this);
        this.events.on('playerAttack', this.onPlayerAttack, this);
        
        // Pausar con ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });
    }
    
    // Crear textos de interfaz
    createUI() {
        this.healthText = this.add.text(16, 16, '', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        });
        
        this.coinsText = this.add.text(16, 50, '', {
            fontSize: '24px',
            fill: '#FFD700',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        });
        
        // Indicador de cooldown de ataque
        this.attackText = this.add.text(16, 84, '', {
            fontSize: '20px',
            fill: '#ff6666',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        });
        
        this.updateUI();
    }
    
    // Actualizar textos de la UI
    updateUI() {
        if (this.player && this.player.alive) {
            this.healthText.setText(`Vida: ${this.player.health}/${this.player.maxHealth}`);
            this.coinsText.setText(`Monedas: ${this.player.coins}`);
            
            // Indicador de ataque
            if (this.player.canAttack) {
                this.attackText.setText('🗡️ Click para atacar');
            } else {
                this.attackText.setText('⏳ Recargando...');
            }
        }
    }
    
    // Se ejecuta cada frame
    update() {
        // Actualizar jugador
        if (this.player && this.player.alive) {
            this.player.update();
        }
        
        // Actualizar todos los enemigos
        if (this.enemyManager) {
            this.enemyManager.updateAll();
        }
        
        // Actualizar UI
        this.updateUI();
    }
    
    // Cuando el jugador toca un enemigo
    onPlayerHitEnemy(player, enemy) {
        player.takeDamage(enemy.damage);
        enemy.die();
    }
    
    // Cuando el jugador ataca
    onPlayerAttack(attackData) {
        // attackData contiene: x, y, range, damage
        
        // Buscar enemigos dentro del rango de ataque
        this.enemyManager.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(
                attackData.x, 
                attackData.y, 
                enemy.x, 
                enemy.y
            );
            
            // Si el enemigo está dentro del rango, recibe daño
            if (distance <= attackData.range) {
                enemy.takeDamage(attackData.damage);
            }
        });
    }
    
    // Cuando muere un enemigo
    onEnemyKilled(coinReward) {
        if (this.player && this.player.alive) {
            this.player.addCoins(coinReward);
        }
    }
    
    // Cuando muere el jugador
    onPlayerDied() {
        this.enemyManager.stopSpawning();
        this.physics.pause();
        
        // Mostrar Game Over
        this.add.text(400, 300, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        // Ir al menú de Game Over después de 2 segundos
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverMenu', {
                coins: this.player.coins
            });
        });
    }
}