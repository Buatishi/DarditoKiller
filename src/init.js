import { MainMenu, PauseMenu, GameOverMenu } from './scenes/menus.js';
import { GameScene } from './scenes/GameScene.js';
import { ScoresScene } from './scenes/scores.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 640,
    physics: { 
        default: 'arcade',
        arcade: { 
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [MainMenu,ScoresScene, GameScene, PauseMenu, GameOverMenu]
};

const game = new Phaser.Game(config);