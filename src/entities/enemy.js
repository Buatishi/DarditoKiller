import { Entity } from './entity.js';
import { COLORS, TEXT_COLORS } from '../config/colors.js';

export class Enemy extends Entity {
  speed;
  damage;
  coinReward;
  target;
  circle;

constructor(scene, x, y, health, speed, damage) {
  super(scene, x, y, null, health);

  // Crear circulo visual
  this.circle = scene.add.circle(0, 0, 30, COLORS.accent);
  this.circle.setStrokeStyle(2, 0xff6b6b, 0.8); 
  
  this.speed = speed;
  this.damage = damage;
  this.coinReward = 10;
  this.target = null;
  this.frozen = false;
  
  // Primero desactivar el body rectangular por defecto
  this.body.setSize(60, 60); //(diametro = radio * 2)
  this.setCircle(30); // Radio 30 = diametro 60
  
  // Centrar el offset del body para que coincida con el circulo visual
  this.body.setOffset(-15, -15); // Ajustar el offset para centrar la colision
}

  setTarget(player) {
    this.target = player;
  }

  update() {
    if (!this.alive || !this.target || !this.target.alive) return;

    // Si esta congelado, no se mueve
    if (this.frozen) return;

    // Actualizar posicion del circulo para que siga al sprite
    if (this.circle) {
      this.circle.setPosition(this.x, this.y);
    }

    // Perseguir al jugador
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );

    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }

  takeDamage(damage) {
    if (!this.alive) return;

    this.health -= damage;

    // Efecto visual en el circulo
    if (this.circle) {
      this.circle.setFillStyle(0xffffff); // Flash blanco
      this.scene.time.delayedCall(100, () => {
        if (this.circle && this.alive) {
          this.circle.setFillStyle(0xe94560); // Volver al color original
        }
      });
    }

    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  die() {
    this.alive = false;
    
    // Destruir circulo visual
    if (this.circle) {
      this.circle.destroy();
    }
    
    // Llamar al manager
    if (this.scene && this.scene.enemyManager) {
      this.scene.enemyManager.onEnemyKilled(this.coinReward);
    }
    
    this.destroy();
  }

  destroy() {
    // Asegurarse de limpiar el circulo
    if (this.circle) {
      this.circle.destroy();
      this.circle = null;
    }
    super.destroy();
  }
}

export class EnemyManager {
  scene;
  enemies;
  player;
  spawnTimer;
  currentWave;
  enemiesPerWave;
  enemiesKilledThisWave;
  baseEnemyHealth;
  baseEnemySpeed;
  baseEnemyDamage;
  waveInProgress;

  constructor(scene) {
    this.scene = scene;
    this.enemies = scene.physics.add.group();
    this.player = null;
    this.spawnTimer = null;
    
    // Inicializar sistema de oleadas
    this.currentWave = 1;
    this.enemiesPerWave = 5;
    this.enemiesKilledThisWave = 0;
    this.baseEnemyHealth = 30;
    this.baseEnemySpeed = 80;
    this.baseEnemyDamage = 10;
    this.waveInProgress = true;
  }

  setPlayer(player) {
    this.player = player;
  }

  // Inicia el spawn continuo de enemigos
  startSpawning() {
    this.spawnTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  stopSpawning() {
    if (this.spawnTimer) {
      this.spawnTimer.remove();
      this.spawnTimer = null;
    }
  }

  // Spawn de un enemigo con estadisticas segun la oleada actual
  spawnEnemy() {
    // Verificaciones mas robustas
    if (!this.player || !this.waveInProgress || !this.enemies || !this.scene || !this.scene.physics) {
      return;
    }

    const side = Phaser.Math.Between(0, 3);
    let x, y;

    // Spawn en los bordes de la pantalla
    switch (side) {
      case 0: // Arriba
        x = Phaser.Math.Between(0, this.scene.scale.width);
        y = -50;
        break;
      case 1: // Derecha
        x = this.scene.scale.width + 50;
        y = Phaser.Math.Between(0, this.scene.scale.height);
        break;
      case 2: // Abajo
        x = Phaser.Math.Between(0, this.scene.scale.width);
        y = this.scene.scale.height + 50;
        break;
      default: // Izquierda
        x = -50;
        y = Phaser.Math.Between(0, this.scene.scale.height);
        break;
    }

    // Calcular estadisticas incrementadas segun la oleada
    const waveMultiplier = 1 + (this.currentWave - 1) * 0.15; // 15% de incremento por oleada
    const health = Math.floor(this.baseEnemyHealth * waveMultiplier);
    const speed = Math.floor(this.baseEnemySpeed * waveMultiplier);
    const damage = Math.floor(this.baseEnemyDamage * waveMultiplier);

    const enemy = new Enemy(this.scene, x, y, health, speed, damage);
    enemy.setTarget(this.player);
    
    // Verificar que el grupo existe antes de agregar
    if (this.enemies && this.enemies.active) {
      this.enemies.add(enemy);
    }
  }

  // Se llama cuando un enemigo es eliminado
  onEnemyKilled(coinReward) {
    // IMPORTANTE: Solo contar kills cuando hay oleada en progreso
    if (!this.waveInProgress) return;

    this.enemiesKilledThisWave++;
    
    // Dar monedas al jugador
    if (this.player && this.player.alive) {
      this.player.addCoins(coinReward);
    }

    // Verificar si se completo la oleada
    if (this.enemiesKilledThisWave >= this.enemiesPerWave) {
      this.completeWave();
    }
  }

completeWave() {
  this.waveInProgress = false;
  this.stopSpawning();

  // === LIMPIAR ENEMIGOS RESTANTES ===
  const enemiesArray = [...this.enemies.children.entries];
  enemiesArray.forEach(enemy => {
    if (enemy && enemy.active && enemy.alive) {
      enemy.alive = false;
      if (enemy.circle) {
        enemy.circle.destroy();
      }
      enemy.setVisible(false);
      enemy.setActive(false);
      enemy.destroy();
    }
  });
  
  // === MENSAJE DE OLEADA COMPLETADA ===
  const messageBg = this.scene.add.rectangle(
    this.scene.scale.width / 2,
    this.scene.scale.height / 2,
    400, 120,
    0x1a1a2e, 0.9
  );
  
  const messageBorder = this.scene.add.rectangle(
    this.scene.scale.width / 2,
    this.scene.scale.height / 2,
    400, 120
  ).setStrokeStyle(3, 0x00d9a3, 0.8);
  
  const message = this.scene.add.text(
    this.scene.scale.width / 2,
    this.scene.scale.height / 2,
    `¡OLEADA ${this.currentWave} COMPLETADA!`,
    {
      fontSize: '36px',
      color: '#00d9a3',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }
  ).setOrigin(0.5);

  // === ANIMACION DEL MENSAJE ===
  messageBg.setScale(0.5).setAlpha(0);
  messageBorder.setScale(0.5).setAlpha(0);
  message.setScale(0.5).setAlpha(0);
  
  this.scene.tweens.add({
    targets: [messageBg, messageBorder, message],
    scale: 1,
    alpha: 1,
    duration: 300,
    ease: 'Back.out'
  });

  // === DESPUES DE 1.5 SEGUNDOS, ABRIR TIENDA ===
  this.scene.time.delayedCall(1500, () => {
    messageBg.destroy();
    messageBorder.destroy();
    message.destroy();
    
    // **FIX: Solo abrir tienda si el jugador sigue vivo**
    if (this.player && this.player.alive) {
      this.scene.scene.pause('GameScene');
      this.scene.scene.launch('ShopScene', {
        player: this.player,
        wave: this.currentWave
      });
    }
    // Si el jugador murio, no hacemos nada (el game over ya se mostro)
  });
}

  // Inicia la siguiente oleada
  startNextWave() {
  this.currentWave++;
  this.enemiesKilledThisWave = 0;
  this.enemiesPerWave += 2;
  this.waveInProgress = true;

  // Emitir evento para actualizar UI
  this.scene.events.emit('waveChanged', this.currentWave);

  // Reiniciar spawn
  this.startSpawning();
}

  updateAll() {
    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.alive) {
        enemy.update();
      }
    });
  }

  // Obtener informacion de la oleada actual
  getWaveInfo() {
    return {
      currentWave: this.currentWave,
      enemiesKilled: this.enemiesKilledThisWave,
      enemiesRequired: this.enemiesPerWave,
      progress: `${this.enemiesKilledThisWave}/${this.enemiesPerWave}`
    };
  }

  destroy() {
    // Detener spawn
    this.stopSpawning();
    
    // IMPORTANTE: Remover event listener
    if (this.scene && this.scene.events) {
      this.scene.events.off('enemyKilled', this.onEnemyKilled, this);
    }
    
    // Destruir todos los enemigos
    if (this.enemies) {
      const enemiesArray = [...this.enemies.children.entries];
      enemiesArray.forEach(enemy => {
        if (enemy && enemy.active && enemy.scene) {
          // Destruir circulo si existe
          if (enemy.circle) {
            enemy.circle.destroy();
          }
          enemy.destroy();
        }
      });
    }
  }
}