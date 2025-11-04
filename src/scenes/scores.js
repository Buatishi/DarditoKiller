export class ScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoresScene' });
    }

preload(){

}

create(){

this.add.rectangle(400, 300, innerWidth, innerHeight, 0x111133);
        
        this.add.text(500, 150, 'PUNTUACIONES', {  
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    
const menuButton = this.add.text(150, 80, 'Menu Principal', {
            fontSize: '30px',
            fill: '#ffffffff',
            backgroundColor: '#8aebf888',
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