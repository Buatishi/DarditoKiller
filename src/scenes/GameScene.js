import Phaser from 'phaser';
import { Player } from '../entities/player.js';
import { EnemyManager } from '../entities/enemy.js';
import { TEXT_COLORS } from '../config/colors.js';


export class GameScene extends Phaser.Scene {


  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.enemies = null;
  }

  preload() {
    this.load.image('fondo', 'assets/scenes/pastito.png');
    this.load.image('jugador', 'assets/entities/prota.png');
    this.load.image('enemigo', 'assets/entities/moni.png');
  }

create() {
    this.events.off('playerDied');
    this.events.off('playerAttack');
    this.events.off('waveChanged');

    let bg = this.add.image(400, 300, 'fondo');
    bg.setDisplaySize(innerWidth, innerHeight);
    
    // Fondo base
    this.add.rectangle(500, 320, innerWidth, innerHeight, 0x1a1a2e);
    
    // Grid sutil
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x0f3460, 0.3);
    
    // Líneas verticales
    for (let x = 0; x < this.scale.width; x += 50) {
        graphics.lineBetween(x, 0, x, this.scale.height);
    }
    
    // Líneas horizontales
    for (let y = 0; y < this.scale.height; y += 50) {
        graphics.lineBetween(0, y, this.scale.width, y);
    }

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
//    this.events.on('enemyKilled', this.onEnemyKilled, this);
    this.events.on('playerAttack', this.onPlayerAttack, this);
    this.events.on('waveChanged', this.onWaveChanged, this);
    
    this.input.keyboard.on('keydown-ESC', () => {
        this.scene.pause();
        this.scene.launch('PauseMenu');
    });
}

shutdown() {
  // Limpiar event listeners de la escena
  this.events.off('playerDied');
  this.events.off('playerAttack');
  this.events.off('waveChanged');
  
  // Limpiar listener del teclado ESC
  this.input.keyboard.off('keydown-ESC');
  
  // Limpiar manager
  if (this.enemyManager) {
    this.enemyManager.destroy();
    this.enemyManager = null;
  }
  
  // Limpiar player
  if (this.player) {
    this.player.destroy();
    this.player = null;
  }
}
    
createUI() {
    // Vida del jugador - con borde rojo
    const healthBg = this.add.rectangle(90, 30, 160, 50, 0x1a1a2e, 0.8);
    const healthBorder = this.add.rectangle(90, 30, 160, 50)
        .setStrokeStyle(2, 0xe94560, 0.5);
    
    this.healthText = this.add.text(90, 30, '', {
        fontSize: '20px',
        color: TEXT_COLORS.red,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Monedas - con borde amarillo
    const coinsBg = this.add.rectangle(90, 85, 140, 45, 0x1a1a2e, 0.8);
    const coinsBorder = this.add.rectangle(90, 85, 140, 45)
        .setStrokeStyle(2, 0xffd700, 0.5);
    
    this.coinsText = this.add.text(90, 85, '', {
        fontSize: '20px',
        color: TEXT_COLORS.yellow,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Estado de ataque - con borde cyan
    const attackBg = this.add.rectangle(90, 135, 140, 40, 0x1a1a2e, 0.8);
    const attackBorder = this.add.rectangle(90, 135, 140, 40)
        .setStrokeStyle(2, 0x00d9a3, 0.4);
    
    this.attackText = this.add.text(90, 135, '', {
        fontSize: '16px',
        color: TEXT_COLORS.cyan,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Contador de oleadas (centro superior) - con borde cyan
    const waveBg = this.add.rectangle(
        this.scale.width / 2,
        40,
        240, 65,
        0x1a1a2e, 0.8
    );
    const waveBorder = this.add.rectangle(
        this.scale.width / 2,
        40,
        240, 65
    ).setStrokeStyle(2, 0x00d9a3, 0.6);
    
    this.waveText = this.add.text(
        this.scale.width / 2,
        30,
        '',
        {
            fontSize: '28px',
            color: TEXT_COLORS.cyan,
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);

    // Progreso de oleada
    this.waveProgressText = this.add.text(
        this.scale.width / 2,
        52,
        '',
        {
            fontSize: '16px',
            color: TEXT_COLORS.text,
            fontFamily: 'Arial'
        }
    ).setOrigin(0.5);

    this.updateUI();
}

  updateUI() {
    if (this.player && this.player.alive) {
        this.healthText.setText(`❤ ${this.player.health}/${this.player.maxHealth}`);
        this.coinsText.setText(`🪙 ${this.player.coins}`);

        if (this.player.canAttack) {
            this.attackText.setText('Z - Atacar');
        } else {
            this.attackText.setText('Recargando...');
        }

        // Actualizar información de oleada
        const waveInfo = this.enemyManager.getWaveInfo();
        this.waveText.setText(`OLEADA ${waveInfo.currentWave}`);
        this.waveProgressText.setText(`Enemigos: ${waveInfo.progress}`);
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
    this.enemyManager.enemies.children.entries.forEach((enemy) => {
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

  onWaveChanged(waveNumber) {
    // Se puede usar para efectos adicionales al cambiar de oleada
    console.log(`Nueva oleada: ${waveNumber}`);
  }

onPlayerDied() {
    this.physics.pause();
    
    if (this.enemyManager) {
        this.enemyManager.stopSpawning();
    }

    // Fondo del Game Over
    const gameOverBg = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        500, 200,
        0x1a1a2e, 0.95
    );
    
    const gameOverBorder = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        500, 200
    ).setStrokeStyle(3, 0xe94560, 0.8);

    // Texto GAME OVER
    this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 - 30,
        'GAME OVER',
        {
            fontSize: '56px',
            color: '#e94560',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);

    // Mostrar oleada alcanzada
    this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        `Oleada alcanzada: ${this.enemyManager.currentWave}`,
        {
            fontSize: '28px',
            color: '#f1f1f1',
            fontFamily: 'Arial'
        }
    ).setOrigin(0.5);

    this.time.delayedCall(3000, () => {
        if (this.enemyManager) {
            this.enemyManager.destroy();
        }
        this.scene.restart();
    });
}

}