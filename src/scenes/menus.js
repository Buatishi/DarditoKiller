import { TEXT_COLORS } from '../config/colors.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Fondo simple
        this.add.rectangle(500, 300, innerWidth, innerHeight, 0x1a1a2e);
        
        // Título simple en cyan
        this.add.text(500, 150, 'DARDITO KILLER', {
            fontSize: '72px',
            color: TEXT_COLORS.cyan,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Botón JUGAR
        const playButton = this.add.text(500, 300, 'JUGAR', {
            fontSize: '48px',
            color: TEXT_COLORS.cyan,
            backgroundColor: '#00d9a320',
            padding: { x: 40, y: 15 }
        }).setOrigin(0.5).setInteractive();
        
        playButton.on('pointerover', () => {
            playButton.setScale(1.05);
            playButton.setStyle({ backgroundColor: '#00d9a340' });
        });
        
        playButton.on('pointerout', () => {
            playButton.setScale(1);
            playButton.setStyle({ backgroundColor: '#00d9a320' });
        });
        
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Botón PUNTUACIONES
        const scoresButton = this.add.text(500, 400, 'PUNTUACIONES', {
            fontSize: '36px',
            color: TEXT_COLORS.textMuted,
            backgroundColor: '#16213e80',
            padding: { x: 30, y: 12 }
        }).setOrigin(0.5).setInteractive();
        
        scoresButton.on('pointerover', () => {
            scoresButton.setScale(1.05);
            scoresButton.setStyle({ backgroundColor: '#16213eaa' });
        });
        
        scoresButton.on('pointerout', () => {
            scoresButton.setScale(1);
            scoresButton.setStyle({ backgroundColor: '#16213e80' });
        });
        
        scoresButton.on('pointerdown', () => {
            this.scene.start('ScoresScene');
        });
        
        // Instrucciones
        this.add.text(500, 550, 'Flechas para mover • Z para atacar • ESC para pausar', {
            fontSize: '20px',
            color: TEXT_COLORS.textMuted,
            align: 'center'
        }).setOrigin(0.5);
    }
}

export class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu' });
    }

    create() {
        // Fondo semi-transparente oscuro
        this.add.rectangle(500, 300, innerWidth, innerHeight, 0x000000, 0.8);
        
        // Contenedor del menú
        const pauseBg = this.add.rectangle(500, 300, 400, 300, 0x1a1a2e, 0.95);
        const pauseBorder = this.add.rectangle(500, 300, 400, 300)
            .setStrokeStyle(3, 0x00d9a3, 0.6);
        
        // Título PAUSA
        this.add.text(500, 200, 'PAUSA', {
            fontSize: '56px',
            color: '#00d9a3',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Botón CONTINUAR
        const resumeButton = this.add.text(500, 300, 'CONTINUAR', {
            fontSize: '32px',
            color: '#00d9a3',
            backgroundColor: '#00d9a320',
            padding: { x: 30, y: 12 }
        }).setOrigin(0.5).setInteractive();
        
        resumeButton.on('pointerover', () => {
            resumeButton.setScale(1.05);
        });
        
        resumeButton.on('pointerout', () => {
            resumeButton.setScale(1);
        });
        
        resumeButton.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
        
        // Botón MENÚ PRINCIPAL
        const menuButton = this.add.text(500, 370, 'MENÚ PRINCIPAL', {
            fontSize: '28px',
            color: '#e94560',
            backgroundColor: '#e9456020',
            padding: { x: 25, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerover', () => {
            menuButton.setScale(1.05);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
        });
        
        menuButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MainMenu');
        });
        
        // Presionar ESC para volver
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}