class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }
    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        //this.add.text(320, 240, "play scene").setOrigin(0.5, 0.5);

        this.add.rectangle(0, borderUISize + borderPadding, config.width, borderUISize * 2, 0x00ff00).setOrigin(0,0);

        this.add.rectangle(0, 0, config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, config.height-borderUISize, config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, config.height, 0xffffff).setOrigin(0,0);
        this.add.rectangle(config.width-borderUISize, 0, borderUISize, config.height, 0xffffff).setOrigin(0,0);

        this.p1Rocket = new RocketP1(this, config.width/4, config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new RocketP2(this, 3*config.width/4, config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new SpaceshipRtoL(this, config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new SpaceshipRtoL(this, config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new SpaceshipRtoL(this, config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        this.ship04 = new SpaceshipLtoR(this, 0 - borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(1, 0);
        this.ship05 = new SpaceshipLtoR(this, 0 - borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(1, 0);
        this.ship06 = new SpaceshipLtoR(this, 0, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(1, 0);

        //Player 1 controls
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //Player 2 controls
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //Game Controls
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start:0, end: 9, first: 0}),
            frameRate: 30
        })

        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(config.width/2, config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(config.width/2, config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        this.starfield.tilePositionX -= 2;
        if(!this.gameOver) {
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
            this.ship05.update();
            this.ship06.update();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start('menu');
        }

        if(this.checkCollision(this.p2Rocket, this.ship01)) {
            this.shipExplode(this.ship01);
            this.p2Rocket.reset();
        }
        if(this.checkCollision(this.p2Rocket, this.ship02)) {
            this.shipExplode(this.ship02);
            this.p2Rocket.reset();
        }
        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.shipExplode(this.ship03);
            this.p2Rocket.reset();
        }

        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.shipExplode(this.ship04);
            this.p1Rocket.reset();
        }
        if(this.checkCollision(this.p1Rocket, this.ship05)) {
            this.shipExplode(this.ship05);
            this.p1Rocket.reset();
        }
        if(this.checkCollision(this.p1Rocket, this.ship06)) {
            this.shipExplode(this.ship06);
            this.p1Rocket.reset();
        }
    }

    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        
        this.p1Score += ship.point;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');
    }
}