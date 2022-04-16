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

        this.p1Rocket = new Rocket(this, config.width/4, config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new Rocket(this, 3*config.width/4, config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        this.ship04 = new Spaceship(this, 0 - borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(1, 0);
        this.ship05 = new Spaceship(this, 0 - borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(1, 0);
        this.ship06 = new Spaceship(this, 0, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(1, 0);
        this.ship04.dir = 'LtoR';
        this.ship05.dir = 'LtoR';
        this.ship06.dir = 'LtoR';

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
        scoreConfig.align = 'left';
        this.scoreRight = this.add.text(config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding * 2, this.p2Score, scoreConfig);

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
            this.p1_update();
            this.p2_update();
            this.shipRtoL_update(this.ship01);
            this.shipRtoL_update(this.ship02);
            this.shipRtoL_update(this.ship03);
            this.shipLtoR_update(this.ship04);
            this.shipLtoR_update(this.ship05);
            this.shipLtoR_update(this.ship06);
            
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start('menu');
        }

        if(this.RtoLcheckCollision(this.p2Rocket, this.ship01)
         || this.RtoLcheckCollision(this.p1Rocket, this.ship01)) {
            this.shipExplode(this.ship01);
            if(this.p2Rocket.isFiring) {
                this.p2Rocket.reset();
            } else {
                this.p1Rocket.reset();
            }
        }
        if(this.RtoLcheckCollision(this.p2Rocket, this.ship02)
         || this.RtoLcheckCollision(this.p1Rocket, this.ship02)) {
            this.shipExplode(this.ship02);
            if(this.p2Rocket.isFiring) {
                this.p2Rocket.reset();
            } else {
                this.p1Rocket.reset();
            }
        }
        if(this.RtoLcheckCollision(this.p2Rocket, this.ship03)
         || this.RtoLcheckCollision(this.p1Rocket, this.ship03)) {
            this.shipExplode(this.ship03);
            if(this.p2Rocket.isFiring) {
                this.p2Rocket.reset();
            } else {
                this.p1Rocket.reset();
            }
        }
        if(this.LtoRcheckCollision(this.p2Rocket, this.ship04)
         || this.LtoRcheckCollision(this.p1Rocket, this.ship04)) {
            this.shipExplode(this.ship04);
            if(this.p2Rocket.isFiring) {
                this.p2Rocket.reset();
            } else {
                this.p1Rocket.reset();
            }
        }
        if(this.LtoRcheckCollision(this.p2Rocket, this.ship05) 
        || this.LtoRcheckCollision(this.p1Rocket, this.ship05)) {
            this.shipExplode(this.ship05);
            if(this.p2Rocket.isFiring) {
                this.p2Rocket.reset();
            } else {
                this.p1Rocket.reset();
            }
        }
        if(this.LtoRcheckCollision(this.p2Rocket, this.ship06)
         || this.LtoRcheckCollision(this.p1Rocket, this.ship06)) {
            this.shipExplode(this.ship06);
            if(this.p2Rocket.isFiring) {
                this.p2Rocket.reset();
            } else {
                this.p1Rocket.reset();
            }
        }
    }

    p1_update() {
        if(!this.p1Rocket.isFiring) {
            if(keyA.isDown && this.p1Rocket.x >= borderUISize + this.p1Rocket.width) {
                this.p1Rocket.x -= this.p1Rocket.moveSpeed;
            } else if(keyD.isDown && this.p1Rocket.x <= config.width/2 - this.p1Rocket.width) {
                this.p1Rocket.x += this.p1Rocket.moveSpeed;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyW)) {
            if(this.p1Rocket.isFiring === false){
                this.p1Rocket.sfxRocket.play();
            }
            this.p1Rocket.isFiring = true;
        }
        if(this.p1Rocket.isFiring && this.p1Rocket.y >= borderUISize * 3 + borderPadding) {
            this.p1Rocket.y -= this.p1Rocket.moveSpeed;
        }
        if(this.p1Rocket.y <= borderUISize * 3 + borderPadding) {
            this.p1Rocket.isFiring = false;
            this.p1Rocket.y = config.height - borderUISize - borderPadding;
        }
    }

    p2_update() {
        if(!this.p2Rocket.isFiring) {
            if(keyLEFT.isDown && this.p2Rocket.x >= config.width/2 + this.p2Rocket.width) {
                this.p2Rocket.x -= this.p2Rocket.moveSpeed;
            } else if(keyRIGHT.isDown && this.p2Rocket.x <= config.width - borderUISize - this.p2Rocket.width) {
                this.p2Rocket.x += this.p2Rocket.moveSpeed;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            if(this.p2Rocket.isFiring === false){
                this.p2Rocket.sfxRocket.play();
            }
            this.p2Rocket.isFiring = true;
        }
        if(this.p2Rocket.isFiring && this.p2Rocket.y >= borderUISize * 3 + borderPadding) {
            this.p2Rocket.y -= this.p2Rocket.moveSpeed;
        }
        if(this.p2Rocket.y <= borderUISize * 3 + borderPadding) {
            this.p2Rocket.isFiring = false;
            this.p2Rocket.y = config.height - borderUISize - borderPadding;
        }
    }

    shipLtoR_update(ship) {
        ship.x += ship.moveSpeed;
        if(ship.x >= config.width + ship.width) {
            ship.x = 0;
        }
    }

    shipRtoL_update(ship) {
        ship.x -= ship.moveSpeed;
        if(ship.x <= 0 - ship.width) {
            ship.x = config.width;
        }
    }

    RtoLcheckCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y) {
                if(rocket === this.p2Rocket) {
                    this.p2Score += ship.point;
                    this.scoreRight.text = this.p2Score;
                } else {
                    this.p1Score += ship.point;
                    this.scoreLeft.text = this.p1Score;
                }
                return true;
        } else {
            return false;
        }
    }

    LtoRcheckCollision(rocket, ship) {
        if(rocket.x > ship.x - ship.width && 
            rocket.x + rocket.width < ship.x && 
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y) {
                if(rocket === this.p2Rocket) {
                    this.p2Score += ship.point;
                    this.scoreRight.text = this.p2Score;
                } else {
                    this.p1Score += ship.point;
                    this.scoreLeft.text = this.p1Score;
                }
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