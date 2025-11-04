import { Player } from '../entities/player.js';
import { EnemyManager } from '../entities/enemy.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload() {
        this.load.image('fondo', './assets/scenes/pastito.jpg');
        this.load.image('jugador', './assets/entities/prota.png');
        this.load.image('enemigo', './assets/entities/moni.jpg');
    }
    
    create() {
        let bg = this.add.image(400, 300, 'fondo');
        bg.setDisplaySize(innerWidth, innerHeight);
        
        this.player = new Player(this, 500, 300);
        
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.setPlayer(this.player);
        this.enemyManager.startSpawning();
        
        this.physics.add.overlap(
            this.player,
            this.enemyManager.enemies,
            this.onPlayerHitEnemy,
            null,
            this
        );
        
        this.createUI();
        
        this.events.on('playerDied', this.onPlayerDied, this);
        this.events.on('enemyKilled', this.onEnemyKilled, this);
        this.events.on('playerAttack', this.onPlayerAttack, this);
        
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });
    }
    
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
        
        this.attackText = this.add.text(16, 84, '', {
            fontSize: '20px',
            fill: '#ff6666',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 5 }
        });
        
        this.updateUI();
    }
    
    updateUI() {
        if (this.player && this.player.alive) {
            this.healthText.setText(`Vida: ${this.player.health}/${this.player.maxHealth}`);
            this.coinsText.setText(`Monedas: ${this.player.coins}`);
            
            if (this.player.canAttack) {
                this.attackText.setText('Tecla Z - atacas');
            } else {
                this.attackText.setText('Recargando...');
            }
        }
    }
    
    update() {
        if (this.player && this.player.alive) {
            this.player.update();
        }
        
        if (this.enemyManager) {
            this.enemyManager.updateAll();
        }
        
        this.updateUI();
    }
    
onPlayerHitEnemy(player, enemy) {
    if (player.alive && enemy.alive) {
        player.takeDamage(enemy.damage);
        
        enemy.health = 0;
        enemy.die();
    }
}
    
    onPlayerAttack(attackData) {
        this.enemyManager.enemies.children.entries.forEach(enemy => {
            if (enemy.alive) {
                const distance = Phaser.Math.Distance.Between(
                    attackData.x, 
                    attackData.y, 
                    enemy.x, 
                    enemy.y
                );
                
                if (distance <= attackData.range) {
                    enemy.takeDamage(attackData.damage);
                }
            }
        });
    }
    
    onEnemyKilled(coinReward) {
        if (this.player && this.player.alive) {
            this.player.addCoins(coinReward);
        }
    }
    
    onPlayerDied() {
        this.enemyManager.stopSpawning();
        this.physics.pause();
        
        this.add.text(500, 300, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverMenu', {
                coins: this.player.coins
            });
        });
    }
}