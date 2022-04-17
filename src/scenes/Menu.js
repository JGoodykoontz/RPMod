class Menu extends Phaser.Scene {
    constructor() {
        super("menu"); 
    }
    preload() {
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_explosion', './assets/fish.wav');
        this.load.audio('sfx_rocket', './assets/harpoon.wav');
        this.load.image('menuImage', './assets/menu.png');
        this.load.image('background1', './assets/underSea_back.png');
        this.load.image('background2', './assets/underSea_seaweed.png');
        this.load.image('background3', './assets/underSea_backRock.png');
        this.load.image('background4', './assets/underSea_foreground.png');
    }
    create() {
        this.background1 = this.add.tileSprite(0, 0, 640, 480, 'background1').setOrigin(0,0);
        this.background2 = this.add.tileSprite(0, 0, 640, 480, 'background2').setOrigin(0,0);
        this.background3 = this.add.tileSprite(0, 0, 640, 480, 'background3').setOrigin(0,0);
        this.background4 = this.add.tileSprite(0, 0, 640, 480, 'background4').setOrigin(0,0);
        this.background = this.add.tileSprite(0, 0, 640, 480, 'menuImage').setOrigin(0,0);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        this.background.tilePositionX += 0;
        this.background2.tilePositionX -= 1;
        this.background3.tilePositionX -= 2;
        this.background4.tilePositionX -= 3;
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('play');
        }
        
    }
}