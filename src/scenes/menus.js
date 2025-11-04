export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
    }

    create() {
        this.add.rectangle(400, 300, innerWidth, innerHeight, 0x222222);
        
        this.add.text(500, 150, 'DARDITO KILLER', {
            fontSize: '64px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const playButton = this.add.text(500, 300, 'JUGAR', {
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

        const scoresButton = this.add.text(500, 400, 'SCORES', {
            fontSize: '48px',
            fill: '#00ff00',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        scoresButton.on('pointerover', () => {
            scoresButton.setScale(1.1);
        });
        
        scoresButton.on('pointerout', () => {
            scoresButton.setScale(1);
        });
        
        scoresButton.on('pointerdown', () => {
            this.scene.start('ScoresScene');
        });
        
        this.add.text(500, 550, 'Usa las flechas para moverte\nESC para pausar', {
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
        this.add.rectangle(500, 300, innerWidth, innerHeight, 0x000000, 0.7);
        
        this.add.text(500, 200, 'PAUSA', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const resumeButton = this.add.text(500, 300, 'CONTINUAR', {
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
        
        const menuButton = this.add.text(500, 380, 'MENÚ PRINCIPAL', {
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
        const coins = data.coins || 0;
        const wave = data.wave || 1;
        
        this.add.rectangle(500, 300, innerWidth, innerHeight, 0x220000);
        
        this.add.text(500, 150, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(500, 250, `Oleada alcanzada: ${wave}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(500, 300, `Monedas obtenidas: ${coins}`, {
            fontSize: '32px',
            fill: '#FFD700'
        }).setOrigin(0.5);
        
        const retryButton = this.add.text(500, 400, 'REINTENTAR', {
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
        
        const menuButton = this.add.text(500, 480, 'MENÚ PRINCIPAL', {
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