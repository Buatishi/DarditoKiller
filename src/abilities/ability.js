// Cada item tiene:
// - id: identificador único
// - name: nombre de habilidad
// - key: tecla a presionar (1-9)
// - icon: ruta de imagen en assets/abilities/
// - wave: en que wave aparece
// - cooldown: tiempo de cooldown en ms
// - effect: función que afecta al player o escena

export const ABILITIES = [
  {
    id: 'fireball',
    name: 'Bola de Fuego',
    key: '1',
    icon: 'ability_1',
    wave: 2,
    cooldown: 5000,
    effect: (player, scene) => {
      const fireball = scene.add.circle(player.x, player.y, 50, 0xff4500, 0.8);
      scene.physics.add.existing(fireball);
      fireball.body.setVelocity(0, -300); 

      scene.physics.add.overlap(fireball, scene.enemyManager.enemies, (fireball, enemy) => {
        if (enemy.alive) {
          enemy.takeDamage(30);
          fireball.destroy();
        }
      });

      scene.time.delayedCall(2000, () => {
        if (fireball.active) fireball.destroy();
      });
    }
  },
  {
    id: 'heal',
    name: 'Curación',
    key: '2',
    icon: 'ability_2',
    wave: 3,
    cooldown: 10000, 
    effect: (player, scene) => {
      player.health = Math.min(player.maxHealth, player.health + 50);

      const healEffect = scene.add.circle(player.x, player.y, 30, 0x00ff00, 0.5);
      scene.tweens.add({
        targets: healEffect,
        alpha: 0,
        scale: 2,
        duration: 500,
        onComplete: () => healEffect.destroy()
      });
    }
  },
  {
    id: 'freeze',
    name: 'Congelación',
    key: '3',
    icon: 'ability_3',
    wave: 4,
    cooldown: 8000, 
    effect: (player, scene) => {
      
      scene.enemyManager.enemies.children.entries.forEach(enemy => {
        if (enemy.alive) {
          enemy.setTint(0x87ceeb);
          enemy.frozen = true;
          enemy.body.setVelocity(0, 0);
        }
      });

      scene.time.delayedCall(3000, () => {
        scene.enemyManager.enemies.children.entries.forEach(enemy => {
          if (enemy.alive) {
            enemy.clearTint();
            enemy.frozen = false;
          }
        });
      });
    }
  },
  {
    id: 'lightning',
    name: 'Rayo',
    key: '4',
    icon: 'ability_4',
    wave: 5,
    cooldown: 7000, 
    effect: (player, scene) => {
      
      let closestEnemy = null;
      let minDistance = Infinity;

      scene.enemyManager.enemies.children.entries.forEach(enemy => {
        if (enemy.alive) {
          const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
          if (distance < minDistance) {
            minDistance = distance;
            closestEnemy = enemy;
          }
        }
      });

      if (closestEnemy) {
        closestEnemy.takeDamage(60);
        
        const lightning = scene.add.line(0, 0, player.x, player.y, closestEnemy.x, closestEnemy.y, 0xffff00);
        lightning.setLineWidth(3);
        scene.time.delayedCall(200, () => lightning.destroy());
      }
    }
  },
  {
    id: 'shield',
    name: 'Escudo',
    key: '5',
    icon: 'ability_5',
    wave: 6,
    cooldown: 15000, 
    effect: (player, scene) => {
      player.shielded = true;
      player.shieldEndTime = scene.time.now + 5000;

      const shield = scene.add.circle(player.x, player.y, 60, 0x00ffff, 0.3);
      shield.setStrokeStyle(2, 0x00ffff);

      const updateShield = () => {
        if (player.alive && player.shielded && scene.time.now < player.shieldEndTime) {
          shield.setPosition(player.x, player.y);
          scene.time.delayedCall(16, updateShield); 
        } else {
          shield.destroy();
          player.shielded = false;
        }
      };
      updateShield();
    }
  }
];

export class AbilityManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.unlockedAbilities = [];
    this.abilityCooldowns = new Map();
    this.currentWave = 1;

    scene.events.on('waveChanged', this.onWaveChanged, this);

    this.keys = {};
    const keyCodes = [
      null,
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
      Phaser.Input.Keyboard.KeyCodes.SIX,
      Phaser.Input.Keyboard.KeyCodes.SEVEN,
      Phaser.Input.Keyboard.KeyCodes.EIGHT,
      Phaser.Input.Keyboard.KeyCodes.NINE
    ];
    for (let i = 1; i <= 9; i++) {
      this.keys[i] = scene.input.keyboard.addKey(keyCodes[i]);
    }

    this.createAbilityUI();
  }

  onWaveChanged(waveNumber) {
    this.currentWave = waveNumber;
    this.checkUnlocks();
  }

  checkUnlocks() {
    ABILITIES.forEach(ability => {
      if (ability.wave <= this.currentWave && !this.unlockedAbilities.find(a => a.id === ability.id)) {
        this.unlockedAbilities.push(ability);
        this.updateAbilityUI();
        console.log(`Habilidad desbloqueada: ${ability.name}`);
      }
    });
  }

  createAbilityUI() {
    this.abilitySlots = [];
    const slotSize = 60;
    const spacing = 10;
    const totalWidth = 9 * slotSize + 8 * spacing;
    const startX = (this.scene.scale.width - totalWidth) / 2;
    const y = this.scene.scale.height - 80;

    for (let i = 1; i <= 9; i++) {
      const x = startX + (i - 1) * (slotSize + spacing);

      const slotBg = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x333333, 0.8);
      slotBg.setStrokeStyle(1, 0x666666);

      const keyText = this.scene.add.text(x, y - slotSize/2 - 15, i.toString(), {
        fontSize: '12px',
        color: '#ffffff'
      }).setOrigin(0.5);

      let iconSprite;
      const texKey = `ability_${i}`;

      iconSprite = this.scene.add.sprite(x, y, texKey);
      iconSprite.setDisplaySize(slotSize - 10, slotSize - 10);
      iconSprite.setVisible(false);

      const cooldownOverlay = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x000000, 0.7);
      cooldownOverlay.setVisible(false);

      const availableFrame = this.scene.add.rectangle(x, y, slotSize, slotSize);
      availableFrame.setStrokeStyle(2, 0x00d9a3, 0.8);
      availableFrame.setVisible(false);

      this.abilitySlots.push({
        bg: slotBg,
        keyText: keyText,
        icon: iconSprite,
        cooldownOverlay: cooldownOverlay,
        availableFrame: availableFrame,
        ability: null
      });
    }
  }

  updateAbilityUI() {
    this.abilitySlots.forEach((slot, index) => {
      const ability = this.unlockedAbilities[index];
      if (ability) {
        slot.icon.setVisible(true);
        slot.availableFrame.setVisible(true);
        slot.ability = ability;
      }
    });
  }

  update() {
    this.unlockedAbilities.forEach(ability => {
      const key = this.keys[ability.key];
      if (key && Phaser.Input.Keyboard.JustDown(key)) {
        this.activateAbility(ability);
      }
    });

    this.abilitySlots.forEach(slot => {
      if (slot.ability) {
        const cooldownEnd = this.abilityCooldowns.get(slot.ability.id);
        if (cooldownEnd) {
          const remaining = cooldownEnd - this.scene.time.now;
          if (remaining > 0) {
            slot.cooldownOverlay.setVisible(true);
            const progress = remaining / slot.ability.cooldown;
            slot.cooldownOverlay.setScale(1, progress);
            slot.availableFrame.setVisible(false);
          } else {
            slot.cooldownOverlay.setVisible(false);
            slot.availableFrame.setVisible(true);
            this.abilityCooldowns.delete(slot.ability.id);
          }
        }
      }
    });
  }

  activateAbility(ability) {
    const cooldownEnd = this.abilityCooldowns.get(ability.id);
    if (cooldownEnd && this.scene.time.now < cooldownEnd) {
      return; 
    }

    ability.effect(this.player, this.scene);

    this.abilityCooldowns.set(ability.id, this.scene.time.now + ability.cooldown);

    console.log(`Habilidad activada: ${ability.name}`);
  }

  destroy() {
    this.scene.events.off('waveChanged', this.onWaveChanged, this);
    this.abilitySlots.forEach(slot => {
      slot.bg.destroy();
      slot.keyText.destroy();
      slot.icon.destroy();
      slot.cooldownOverlay.destroy();
      slot.availableFrame.destroy();
    });
  }
}