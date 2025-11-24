import { Player } from '../entities/player.js';
import { EnemyManager } from '../entities/enemy.js';
import { AbilityManager } from '../abilities/ability.js';
import { TEXT_COLORS as COLORS } from '../config/colors.js';



export class GameScene extends Phaser.Scene {


  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.enemies = null;
  }

  preload() {
    this.load.image('jugador', 'assets/entities/prota.png');

    for (let i = 1; i <= 9; i++) {
      this.load.image(`ability_${i}`, `assets/abilities/ability_${i}.png`);
    }
  }

create() {
    this.events.off('playerDied');
    this.events.off('playerAttack');
    this.events.off('waveChanged');
    
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x1a1a2e);
    
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x0f3460, 0.3);
    
    for (let x = 0; x < this.scale.width; x += 50) {
        graphics.lineBetween(x, 0, x, this.scale.height);
    }
    
    for (let y = 0; y < this.scale.height; y += 50) {
        graphics.lineBetween(0, y, this.scale.width, y);
    }

    this.player = new Player(this, 500, 300);
    
    this.player.setCollideWorldBounds(true); 

    this.enemyManager = new EnemyManager(this);
    this.enemyManager.setPlayer(this.player);
    this.enemyManager.startSpawning();

    this.abilityManager = new AbilityManager(this, this.player);
        
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
  this.events.off('playerDied');
  this.events.off('playerAttack');
  this.events.off('waveChanged');
  
  this.input.keyboard.off('keydown-ESC');
  
  if (this.enemyManager) {
    this.enemyManager.destroy();
    this.enemyManager = null;
  }
  
  if (this.player) {
    this.player.destroy();
    this.player = null;
  }
}
    
createUI() {
    const healthBg = this.add.rectangle(90, 30, 160, 50, 0x000000, 0.8);
    const healthBorder = this.add.rectangle(90, 30, 160, 50)
        .setStrokeStyle(2, COLORS.accent, 0.5);
    
    this.healthText = this.add.text(90, 30, '', {
        fontSize: '20px',
        color: COLORS.red,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    const coinsBg = this.add.rectangle(90, 85, 140, 45, 0x000000, 0.8);
    const coinsBorder = this.add.rectangle(90, 85, 140, 45)
        .setStrokeStyle(2, COLORS.accent, 0.5);
    
    this.coinsText = this.add.text(90, 85, '', {
        fontSize: '20px',
        color: COLORS.yellow,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    const attackBg = this.add.rectangle(90, 135, 140, 40, 0x000000, 0.8);
    const attackBorder = this.add.rectangle(90, 135, 140, 40)
        .setStrokeStyle(2, COLORS.accent, 0.4);
    
    this.attackText = this.add.text(90, 135, '', {
        fontSize: '16px',
        color: COLORS.cyan,
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.attackCooldownBar = this.add.rectangle(90, 135 + 20, 140, 5, 0xff0000, 1);
    this.attackCooldownBar.setVisible(false);

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
            color: COLORS.cyan,
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }
    ).setOrigin(0.5);

    this.waveProgressText = this.add.text(
        this.scale.width / 2,
        52,
        '',
        {
            fontSize: '16px',
            color: COLORS.text,
            fontFamily: 'Arial'
        }
    ).setOrigin(0.5);

    this.updateUI();
}

  updateUI() {
    if (this.player && this.player.alive) {
        this.healthText.setText(`❤ ${this.player.health}/${this.player.maxHealth}`);
        this.coinsText.setText(`💰 ${this.player.coins}`);

        if (this.player.canAttack) {
            this.attackText.setText('Z - Atacar');
            this.attackCooldownBar.setVisible(false);
        } else {
            this.attackText.setText('Z - Atacar');
            const remaining = this.player.cooldownEndTime - this.time.now;
            if (remaining > 0) {
                const progress = remaining / this.player.attackCooldown;
                this.attackCooldownBar.setScale(progress, 1);
                this.attackCooldownBar.setVisible(true);
            } else {
                this.attackCooldownBar.setVisible(false);
            }
        }

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

    if (this.abilityManager) {
      this.abilityManager.update();
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
    console.log(`Nueva oleada: ${waveNumber}`);
  }

onPlayerDied() {
    this.physics.pause();
    
    if (this.enemyManager) {
        this.enemyManager.stopSpawning();
    }

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