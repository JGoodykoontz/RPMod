class RocketP1 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;

        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        if(!this.isFiring) {
            if(keyA.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if(keyD.isDown && this.x <= config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyW)) {
            if(this.isFiring === false){
                this.sfxRocket.play();
            }
            this.isFiring = true;
        }
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.y = config.height - borderUISize - borderPadding;
        }
    }

    reset() {
        this.isFiring = false;
        this.y = config.height - borderUISize - borderPadding;
    }
}
