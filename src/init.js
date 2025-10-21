import { MainMenu, PauseMenu, GameOverMenu } from './scenes/menus.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { 
        default: 'arcade',
        arcade: { 
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [MainMenu, GameScene, PauseMenu, GameOverMenu]
};

const game = new Phaser.Game(config);