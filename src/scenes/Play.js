class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }
    preload() {
        this.load.image('harpoon', './assets/harpoon.png');
        this.load.image('fish', './assets/fish.png');
        this.load.image('fish2', './assets/fish2.png');
        this.load.image('background1', './assets/underSea_back.png');
        this.load.image('background2', './assets/underSea_seaweed.png');
        this.load.image('background3', './assets/underSea_backRock.png');
        this.load.image('background4', './assets/underSea_foreground.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        this.background1 = this.add.tileSprite(0, 0, 640, 480, 'background1').setOrigin(0,0);
        this.background2 = this.add.tileSprite(0, 0, 640, 480, 'background2').setOrigin(0,0);
        this.background3 = this.add.tileSprite(0, 0, 640, 480, 'background3').setOrigin(0,0);
        this.background4 = this.add.tileSprite(0, 0, 640, 480, 'background4').setOrigin(0,0);

        this.add.rectangle(0, borderUISize + borderPadding, config.width, borderUISize * 2, 0x41260e).setOrigin(0,0);

        this.p1Harpoon = new Harpoon(this, config.width/4, config.height - borderUISize - borderPadding, 'harpoon').setOrigin(0.5, 0);
        this.p2Harpoon = new Harpoon(this, 3*config.width/4, config.height - borderUISize - borderPadding, 'harpoon').setOrigin(0.5, 0);

        this.fish01 = new FishRtoL(this, config.width + borderUISize * 6, borderUISize * 4, 'fish', 0, 30).setOrigin(0, 0);
        this.fish02 = new FishRtoL(this, config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'fish', 0, 20).setOrigin(0, 0);
        this.fish03 = new FishRtoL(this, config.width, borderUISize * 6 + borderPadding * 4, 'fish', 0, 10).setOrigin(0, 0);

        this.fish04 = new FishLtoR(this, 0 - borderUISize * 6, borderUISize * 4, 'fish2', 0, 30).setOrigin(1, 0);
        this.fish05 = new FishLtoR(this, 0 - borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'fish2', 0, 20).setOrigin(1, 0);
        this.fish06 = new FishLtoR(this, 0, borderUISize * 6 + borderPadding * 4, 'fish2', 0, 10).setOrigin(1, 0);

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
        this.p2Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#41260e',
            color: '#1ffce9',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        scoreConfig.align = 'left';
        this.scoreRight = this.add.text(config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding * 2, this.p2Score, scoreConfig);

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            if(this.p1Score > this.p2Score){
            this.add.text(config.width/2, config.height/2, 'Player 1 Wins!', scoreConfig).setOrigin(0.5);
            } else if(this.p2Score > this.p1Score){
                this.add.text(config.width/2, config.height/2, 'Player 2 Wins!', scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(config.width/2, config.height/2, 'Draw!', scoreConfig).setOrigin(0.5);
            }
            this.add.text(config.width/2, config.height/2 + 64, 'Space to Restart\n\t\tESC for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        this.background2.tilePositionX -= 1;
        this.background3.tilePositionX -= 2;
        this.background4.tilePositionX -= 3;
        if(!this.gameOver) {
            this.p1_update();
            this.p2_update();
            this.fish01.update();
            this.fish02.update();
            this.fish03.update();
            this.fish04.update();
            this.fish05.update();
            this.fish06.update();
            
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start('menu');
        }

        if(this.checkCollision(this.p2Harpoon, this.fish01)
         || this.checkCollision(this.p1Harpoon, this.fish01)) {
            this.shipExplode(this.fish01);
        }
        if(this.checkCollision(this.p2Harpoon, this.fish06)
         || this.checkCollision(this.p1Harpoon, this.fish06)) {
            this.shipExplode(this.fish06);
        }
        if(this.checkCollision(this.p2Harpoon, this.fish02)
         || this.checkCollision(this.p1Harpoon, this.fish02)) {
            this.shipExplode(this.fish02);
        }
        if(this.checkCollision(this.p2Harpoon, this.fish03)
         || this.checkCollision(this.p1Harpoon, this.fish03)) {
            this.shipExplode(this.fish03);
        }
        if(this.checkCollision(this.p2Harpoon, this.fish04)
         || this.checkCollision(this.p1Harpoon, this.fish04)) {
            this.shipExplode(this.fish04);
        }
        if(this.checkCollision(this.p2Harpoon, this.fish05)
         || this.checkCollision(this.p1Harpoon, this.fish05)) {
            this.shipExplode(this.fish05);
        }
    }

    p1_update() {
        if(!this.p1Harpoon.isFiring) {
            if(keyA.isDown && this.p1Harpoon.x >= borderUISize + this.p1Harpoon.width) {
                this.p1Harpoon.x -= this.p1Harpoon.moveSpeed;
            } else if(keyD.isDown && this.p1Harpoon.x <= config.width/2 - this.p1Harpoon.width) {
                this.p1Harpoon.x += this.p1Harpoon.moveSpeed;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyW)) {
            if(this.p1Harpoon.isFiring === false){
                this.p1Harpoon.sfxRocket.play();
            }
            this.p1Harpoon.isFiring = true;
        }
        if(this.p1Harpoon.isFiring && this.p1Harpoon.y >= borderUISize * 3 + borderPadding) {
            this.p1Harpoon.y -= this.p1Harpoon.moveSpeed;
        }
        if(this.p1Harpoon.y <= borderUISize * 3 + borderPadding) {
            this.p1Harpoon.isFiring = false;
            this.p1Harpoon.y = config.height - borderUISize - borderPadding;
        }
    }

    p2_update() {
        if(!this.p2Harpoon.isFiring) {
            if(keyLEFT.isDown && this.p2Harpoon.x >= config.width/2 + this.p2Harpoon.width) {
                this.p2Harpoon.x -= this.p2Harpoon.moveSpeed;
            } else if(keyRIGHT.isDown && this.p2Harpoon.x <= config.width - borderUISize - this.p2Harpoon.width) {
                this.p2Harpoon.x += this.p2Harpoon.moveSpeed;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            if(this.p2Harpoon.isFiring === false){
                this.p2Harpoon.sfxRocket.play();
            }
            this.p2Harpoon.isFiring = true;
        }
        if(this.p2Harpoon.isFiring && this.p2Harpoon.y >= borderUISize * 3 + borderPadding) {
            this.p2Harpoon.y -= this.p2Harpoon.moveSpeed;
        }
        if(this.p2Harpoon.y <= borderUISize * 3 + borderPadding) {
            this.p2Harpoon.isFiring = false;
            this.p2Harpoon.y = config.height - borderUISize - borderPadding;
        }
    }

    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height && 
            rocket.height/4 + rocket.y > ship.y) {
                if(rocket === this.p2Harpoon) {
                    this.p2Score += ship.point;
                    this.scoreRight.text = this.p2Score;
                } else {
                    this.p1Score += ship.point;
                    this.scoreLeft.text = this.p1Score;
                }
                rocket.reset();
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
    
        this.sound.play('sfx_explosion');
    }
}