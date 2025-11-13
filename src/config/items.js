// === LISTA DE TODOS LOS ITEMS DISPONIBLES ===
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
      player.maxHealth += 20;  // Aumenta vida máxima
      player.health += 20;      // Y también la vida actual
    }
  },
  {
    id: 'speed_boost',
    name: 'Botas Rapidas',
    description: '+30 Velocidad',
    cost: 70,
    icon: '👟',
    effect: (player) => {
      player.speed += 30;  // El jugador se mueve más rápido
    }
  },
  {
    id: 'damage_boost',
    name: 'Espada Afilada',
    description: '+10 Daño',
    cost: 90,
    icon: '⚔️',
    effect: (player) => {
      player.damage += 10;  // Cada ataque hace más daño
    }
  },
  {
    id: 'attack_range',
    name: 'Brazo Largo',
    description: '+15 Rango',
    cost: 65,
    icon: '🎯',
    effect: (player) => {
      player.attackRange += 15;  // Ataca desde más lejos
    }
  },
  {
    id: 'attack_speed',
    name: 'Adrenalina',
    description: '-100ms Cooldown',
    cost: 85,
    icon: '⚡',
    effect: (player) => {
      // Reduce el tiempo entre ataques (mínimo 100ms)
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
      // Cura 10 de vida (sin pasar el máximo)
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
// Mezcla todos los items y devuelve los primeros 3
export function getRandomItems(count = 3) {
  // Hacer una copia del array original
  const shuffled = [...ITEMS_POOL];
  
  // Mezclar aleatoriamente (algoritmo Fisher-Yates simplificado)
  shuffled.sort(() => Math.random() - 0.5);
  
  // Devolver solo los primeros 'count' items (por defecto 3)
  return shuffled.slice(0, count);
}