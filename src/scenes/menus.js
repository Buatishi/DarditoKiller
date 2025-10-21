export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Cargar recursos del menú si los hay
    }

    create() {
        // Fondo
        this.add.rectangle(400, 300, 800, 600, 0x222222);
        
        // Título
        this.add.text(400, 150, 'DARDITO KILLER', {
            fontSize: '64px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Botón Jugar
        const playButton = this.add.text(400, 300, 'JUGAR', {
            fontSize: '48px',
            fill: '#00ff00',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
        });
        
        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });
        
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Instrucciones
        this.add.text(400, 450, 'Usa las flechas para moverte\nESC para pausar', {
            fontSize: '24px',
            fill: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);
    }
}

export class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }

    create() {
        // Fondo semi-transparente
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        // Texto de pausa
        this.add.text(400, 200, 'PAUSA', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Botón Continuar
        const resumeButton = this.add.text(400, 300, 'CONTINUAR', {
            fontSize: '36px',
            fill: '#00ff00',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        resumeButton.on('pointerover', () => {
            resumeButton.setScale(1.1);
        });
        
        resumeButton.on('pointerout', () => {
            resumeButton.setScale(1);
        });
        
        resumeButton.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
        
        // Botón Menú Principal
        const menuButton = this.add.text(400, 380, 'MENÚ PRINCIPAL', {
            fontSize: '36px',
            fill: '#ff0000',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerover', () => {
            menuButton.setScale(1.1);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
        });
        
        menuButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MainMenu');
        });
        
        // Permitir ESC para resumir
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}

export class GameOverMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverMenu' });
    }

    create(data) {
        // data contiene { coins, wave }
        const coins = data.coins || 0;
        const wave = data.wave || 1;
        
        // Fondo
        this.add.rectangle(400, 300, 800, 600, 0x220000);
        
        // Título Game Over
        this.add.text(400, 150, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Estadísticas
        this.add.text(400, 250, `Oleada alcanzada: ${wave}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(400, 300, `Monedas obtenidas: ${coins}`, {
            fontSize: '32px',
            fill: '#FFD700'
        }).setOrigin(0.5);
        
        // Botón Reintentar
        const retryButton = this.add.text(400, 400, 'REINTENTAR', {
            fontSize: '40px',
            fill: '#00ff00',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        retryButton.on('pointerover', () => {
            retryButton.setScale(1.1);
        });
        
        retryButton.on('pointerout', () => {
            retryButton.setScale(1);
        });
        
        retryButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Botón Menú Principal
        const menuButton = this.add.text(400, 480, 'MENÚ PRINCIPAL', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerover', () => {
            menuButton.setScale(1.1);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
        });
        
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}