import { MainMenu, PauseMenu } from './scenes/menus.js';
import { GameScene } from './scenes/GameScene.js';
import { ScoresScene } from './scenes/scores.js';
import { ShopScene } from './scenes/shop.js';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 640,
    parent: 'conteiner',
    scale: {
        mode: Phaser.Scale.FIT, //mantiene relacion
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [MainMenu, ScoresScene, GameScene, PauseMenu, ShopScene]
};

const game = new Phaser.Game(config);