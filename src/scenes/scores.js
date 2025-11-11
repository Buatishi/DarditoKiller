import Phaser from 'phaser';
import { TEXT_COLORS } from '../config/colors.js';

export class ScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoresScene' });
    }

    create(){
        this.add.rectangle(500, 300, innerWidth, innerHeight, 0x1a1a2e);
        
        this.add.text(500, 100, 'PUNTUACIONES', {  
            fontSize: '56px',
            color: TEXT_COLORS.cyan,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Aquí irán tus puntuaciones más adelante
        this.add.text(500, 300, 'Próximamente: Últimas 3 partidas', {
            fontSize: '24px',
            color: TEXT_COLORS.textMuted
        }).setOrigin(0.5);
    
        const menuButton = this.add.text(500, 500, 'MENÚ PRINCIPAL', {
            fontSize: '32px',
            color: TEXT_COLORS.textMuted,
            backgroundColor: '#16213e80',
            padding: { x: 30, y: 12 }
        }).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerover', () => {
            menuButton.setScale(1.05);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
        });
        
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}