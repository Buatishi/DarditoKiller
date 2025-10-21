import {MainMenu, PauseMenu, GameOnMenu, GameOverMenu} from './scenes/menus.js'

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { 
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var dardo, cursors;
var moni;
var vida = 100;
var vidaTexto;

function preload() {
    this.load.image('fondo', './assets/scenes/pastito.jpg');
    this.load.image('jugador', './assets/entities/dardo.jpg');
    this.load.image('enemigo', './assets/entities/moni.jpg');
}

function create() {
    let bg = this.add.image(400, 300, 'fondo');
    bg.setDisplaySize(800, 600);
    dardo = this.physics.add.sprite(400, 300, 'jugador');
    dardo.setDisplaySize(60, 60);
    dardo.setCollideWorldBounds(true);
    moni = this.physics.add.group();    
    cursors = this.input.keyboard.createCursorKeys();
    
    this.time.addEvent({
        delay: 2000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });
    
    this.physics.add.overlap(dardo, moni, golpearDardo, null, this);
    
    vidaTexto = this.add.text(16, 16, 'Vida: ' + vida, { 
        fontSize: '32px', 
        fill: '#fff' 
    });
}

function update() {
    dardo.setVelocity(0);
    if (cursors.left.isDown) {
        dardo.setVelocityX(-200);
        dardo.flipX = true;
    }
    if (cursors.right.isDown) {
        dardo.setVelocityX(200);
        dardo.flipX = false;
    }
    if (cursors.up.isDown) dardo.setVelocityY(-200);
    if (cursors.down.isDown) dardo.setVelocityY(200);

    moni.children.entries.forEach(enemigo => {
        this.physics.moveToObject(enemigo, dardo, 50);
    });
}

function spawnEnemy() {
    let x = Phaser.Math.Between(0, 800);
    let y = Phaser.Math.Between(0, 600);
    let enemy = moni.create(x, y, 'enemigo');
    enemy.setDisplaySize(60, 60);
    enemy.setCollideWorldBounds(true);
}

function golpearDardo(dardo, enemigo) {
    vida -= 10;
    vidaTexto.setText('Vida: ' + vida);
    enemigo.destroy();
    
    if (vida <= 0) {
        vidaTexto.setText('GAME OVER');
        this.physics.pause();
    }
}

//commit