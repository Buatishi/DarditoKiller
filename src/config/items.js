// Cada item tiene:
// - id: identificador unico
// - name: nombre que se muestra
// - description: que hace el item
// - cost: cuantas monedas cuesta
// - icon: emoji para mostrar
// - effect: funcion que modifica al jugador

class Item {
  constructor(id, name, description, cost, icon, effect) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.icon = icon;
    this.effect = effect;
  }
}

export const ITEMS_POOL = [
  new Item(
    'health_boost',
    'Corazon Extra',
    '+20 Vida Maxima',
    70,
    '❤️',
    (player) => {
      player.maxHealth += 20; 
      player.health += 20;
    }
  ),
  new Item(
    'speed_boost',
    'Botas Rapidas',
    '+30 Velocidad',
    70,
    '👟',
    (player) => {
      player.speed += 30; 
    }
  ),
  new Item(
    'damage_boost',
    'Espada Afilada',
    '+10 Daño',
    90,
    '⚔️',
    (player) => {
      player.damage += 10; 
    }
  ),
  new Item(
    'attack_range',
    'Brazo Largo',
    '+15 Rango',
    65,
    '🎯',
    (player) => {
      player.attackRange += 15;  
    } 
  ),
  new Item(
    'attack_speed',
    'Adrenalina',
    '-100ms Cooldown',
    85,
    '⚡',
    (player) => {
      player.attackCooldown = Math.max(100, player.attackCooldown - 100);
    }
  ),
  new Item(
    'health_regen',
    'Vendaje',
    '+10 Vida',
    35,
    '💚',
    (player) => {
      player.health = Math.min(player.maxHealth, player.health + 10);
    }
  ),
  new Item(
    'double_damage',
    'Fuerza Bruta',
    '+15 Daño',
    135,
    '💪',
    (player) => {
      player.damage += 15;
    }
  ),
  new Item(
    'mega_health',
    'Corazon Gigante',
    '+30 Vida Max',
    100,
    '💖',
    (player) => {
      player.maxHealth += 30;
      player.health += 30;
    }
  )
];

// === FUNCION PARA OBTENER ITEMS ALEATORIOS ===
export function getRandomItems(count = 3) {
  return [...ITEMS_POOL].sort(() => Math.random() - 0.5).slice(0, count);
}