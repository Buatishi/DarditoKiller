export class MainMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainMenu'
        });
    }

    preload(){
        this.load.image('menuBackground', '../assets/scenes/menuBackground.png')
    }

    create(){

    }
}

export class PauseMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'PauseMenu'
        });
    }

    preload(){
        this.load.image('menuBackground', '../assets/scenes/menuBackground.png')
    }

    create(){

    }
}

export class GameOnMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOnMenu'
        });
    }

    preload(){
        this.load.image('menuBackground', '../assets/scenes/menuBackground.png')
    }

    create(){
        this.add.image(400,300, 'menuBackground')
    }
}

export class GameOverMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverMenu'
        });
    }

    preload(){
        
    }

    create(){

    }
}