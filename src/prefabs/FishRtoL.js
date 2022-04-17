class FishRtoL extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.point = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width) {
            this.x = config.width;
        }
    }

    reset() {
        this.x = config.width;
    }
}