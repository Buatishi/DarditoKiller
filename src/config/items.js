// Cada item tiene:
// - id: identificador único
// - name: nombre que se muestra
// - description: qué hace el item
// - cost: cuántas monedas cuesta
// - icon: emoji para mostrar
// - effect: función que modifica al jugador

export const ITEMS_POOL = [
  {
    id: 'health_boost',
    name: 'Corazon Extra',
    description: '+20 Vida Máxima',
    cost: 70,
    icon: '❤️',
    effect: (player) => {
      player.maxHealth += 20; 
      player.health += 20;
    }
  },
  {
    id: 'speed_boost',
    name: 'Botas Rapidas',
    description: '+30 Velocidad',
    cost: 70,
    icon: '👟',
    effect: (player) => {
      player.speed += 30; 
    }
  },
  {
    id: 'damage_boost',
    name: 'Espada Afilada',
    description: '+10 Daño',
    cost: 90,
    icon: '⚔️',
    effect: (player) => {
      player.damage += 10; 
    }
  },
  {
    id: 'attack_range',
    name: 'Brazo Largo',
    description: '+15 Rango',
    cost: 65,
    icon: '🎯',
    effect: (player) => {
      player.attackRange += 15;  
    }
  },
  {
    id: 'attack_speed',
    name: 'Adrenalina',
    description: '-100ms Cooldown',
    cost: 85,
    icon: '⚡',
    effect: (player) => {
      player.attackCooldown = Math.max(100, player.attackCooldown - 100);
    }
  },
  {
    id: 'health_regen',
    name: 'Vendaje',
    description: '+10 Vida',
    cost: 35,
    icon: '💚',
    effect: (player) => {
      player.health = Math.min(player.maxHealth, player.health + 10);
    }
  },

  {
    id: 'double_damage',
    name: 'Fuerza Bruta',
    description: '+15 Daño',
    cost: 135,
    icon: '💪',
    effect: (player) => {
      player.damage += 15;
    }
  },
  {
    id: 'mega_health',
    name: 'Corazon Gigante',
    description: '+30 Vida Max',
    cost: 100,
    icon: '💖',
    effect: (player) => {
      player.maxHealth += 30;
      player.health += 30;
    }
  },
];

// === FUNCIÓN PARA OBTENER ITEMS ALEATORIOS ===
export function getRandomItems(count = 3) {
  return [...ITEMS_POOL].sort(() => Math.random() - 0.5).slice(0, count);
}