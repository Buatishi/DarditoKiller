import { MainMenu, PauseMenu } from './scenes/menus.js';
import { GameScene } from './scenes/GameScene.js';
import { ScoresScene } from './scenes/scores.js';
import { ShopScene } from './scenes/shop.js';

const config = {
    type: Phaser.AUTO,
    width: 1000, //1000
    height: 640, //640
    parent: 'conteiner', // Asegurar que se renderiza en el contenedor correcto
    scale: {
        mode: Phaser.Scale.FIT, // Escalar para que quepa en la ventana manteniendo proporción
        autoCenter: Phaser.Scale.CENTER_BOTH // Centrar el canvas
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