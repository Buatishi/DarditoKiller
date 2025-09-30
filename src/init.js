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
var player, cursors;

function preload() {
    this.load.image('fondo', './assets/scenes/pastito.jpg');
    this.load.image('jugador', './assets/entities/dardo.jpg');
}

function create() {
    let bg = this.add.image(400, 300, 'fondo');
    bg.setDisplaySize(800, 600);
    player = this.physics.add.sprite(400, 300, 'jugador');
    player.setDisplaySize(60, 60);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocity(0);
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.flipX = true;
    }
    if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.flipX = false;
    }
    if (cursors.up.isDown) player.setVelocityY(-200);
    if (cursors.down.isDown) player.setVelocityY(200);
}