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

function preload() {
    this.load.image('fondo', './assets/scenes/pastito.jpg');
    this.load.image('jugador', './assets/entities/dardo.jpg');
}

function create() {
    let bg = this.add.image(400, 300, 'fondo');
    bg.setDisplaySize(800, 600);
    dardo = this.physics.add.sprite(400, 300, 'jugador');
    dardo.setDisplaySize(60, 60);
    dardo.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
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
}