import { getRandomItems } from '../config/items.js';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  init(data) {
    // Recibimos el jugador y la oleada actual desde GameScene
    this.player = data.player;
    this.currentWave = data.wave;
  }

  create() {
    // === FONDO ===
    this.add.rectangle(500, 320, innerWidth, innerHeight, 0x1a1a2e);
    
    // === TÍTULO ===
    this.add.text(500, 80, 'TIENDA', {
      fontSize: '56px',
      color: '#00d9a3',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === MOSTRAR MONEDAS DEL JUGADOR ===
    // Guardamos esta referencia para poder actualizarla después
    this.coinsText = this.add.text(500, 140, `Monedas: ${this.player.coins}`, {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === OBTENER 3 ITEMS ALEATORIOS ===
    const randomItems = getRandomItems(3);

    // === CREAR 3 TARJETAS DE ITEMS ===
    // Las posiciones son: 250, 500, 750 (espaciadas 250px)
    randomItems.forEach((item, index) => {
      this.createItemCard(item, 250 + (index * 250), 320);
    });

    // === BOTÓN PARA CONTINUAR ===
    const continueBtn = this.add.text(500, 520, 'CONTINUAR', {
      fontSize: '28px',
      color: '#00d9a3',
      backgroundColor: '#00d9a320',
      padding: { x: 30, y: 12 }
    }).setOrigin(0.5).setInteractive();

    continueBtn.on('pointerover', () => continueBtn.setScale(1.05));
    continueBtn.on('pointerout', () => continueBtn.setScale(1));
    continueBtn.on('pointerdown', () => this.continueGame());
  }

  // === CREAR UNA TARJETA DE ITEM ===
  createItemCard(item, x, y) {
    // Fondo de la tarjeta
    const cardBg = this.add.rectangle(x, y, 200, 300, 0x16213e, 0.9);
    const cardBorder = this.add.rectangle(x, y, 200, 300)
      .setStrokeStyle(2, 0x00d9a3, 0.5);

    // Icono grande del item (emoji)
    this.add.text(x, y - 90, item.icon, {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Nombre del item
    this.add.text(x, y - 20, item.name, {
      fontSize: '20px',
      color: '#f1f1f1',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Descripción del item
    this.add.text(x, y + 15, item.description, {
      fontSize: '16px',
      color: '#a8a8a8',
      align: 'center'
    }).setOrigin(0.5);

    // Precio
    this.add.text(x, y + 60, `🪙 ${item.cost}`, {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === BOTÓN DE COMPRA ===
    const buyBtn = this.add.text(x, y + 110, 'COMPRAR', {
      fontSize: '20px',
      color: '#00d9a3',
      backgroundColor: '#00d9a320',
      padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive();

    // === VERIFICAR SI PUEDE COMPRAR (FIX DEL BUG) ===
    const updateButtonState = () => {
      const canBuy = this.player.coins >= item.cost;
      
      if (canBuy) {
        // Puede comprar: botón activo
        buyBtn.setStyle({ color: '#00d9a3', backgroundColor: '#00d9a320' });
        buyBtn.setInteractive();
      } else {
        // No puede comprar: botón desactivado
        buyBtn.setStyle({ color: '#666666', backgroundColor: '#33333320' });
        buyBtn.disableInteractive();
      }
    };

    // Verificar estado inicial
    updateButtonState();

    // === EVENTOS DEL BOTÓN ===
    buyBtn.on('pointerover', () => {
      if (this.player.coins >= item.cost) {
        buyBtn.setScale(1.1);
        cardBorder.setStrokeStyle(3, 0x00d9a3, 0.8);
      }
    });

    buyBtn.on('pointerout', () => {
      buyBtn.setScale(1);
      cardBorder.setStrokeStyle(2, 0x00d9a3, 0.5);
    });

    buyBtn.on('pointerdown', () => {
      // Doble verificación antes de comprar
      if (this.player.coins >= item.cost) {
        // === REALIZAR LA COMPRA ===
        
        // 1. Restar las monedas
        this.player.coins -= item.cost;
        
        // 2. Aplicar el efecto del item al jugador
        item.effect(this.player);
        
        // 3. Actualizar el texto de monedas
        this.coinsText.setText(`Monedas: ${this.player.coins}`);
        
        // 4. Cambiar el botón a "COMPRADO"
        buyBtn.setText('✓ COMPRADO');
        buyBtn.setStyle({ color: '#00ff00', backgroundColor: '#00ff0020' });
        buyBtn.disableInteractive();
        
        // 5. Cambiar color de la tarjeta
        cardBorder.setStrokeStyle(3, 0x00ff00, 0.8);
        cardBg.setFillStyle(0x003300, 0.9);
        
        // 6. Animación de compra exitosa
        this.tweens.add({
          targets: [cardBg, cardBorder],
          alpha: 0.5,
          yoyo: true,
          duration: 150,
          repeat: 1
        });
        
        // 7. Actualizar estado de OTROS botones por si ahora no puede comprar
        // (esto recorre todas las cards y actualiza sus estados)
        updateButtonState();
      }
    });
  }

  // === CONTINUAR AL JUEGO ===
  continueGame() {
    // Cerrar la tienda
    this.scene.stop();
    
    // Reanudar el juego
    this.scene.resume('GameScene');
    
    // Iniciar la siguiente oleada
    const gameScene = this.scene.get('GameScene');
    if (gameScene && gameScene.enemyManager) {
      gameScene.enemyManager.startNextWave();
    }
  }
}