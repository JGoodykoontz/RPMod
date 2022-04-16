class SpaceshipLtoR extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.point = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        this.x += this.moveSpeed;
        if(this.x >= config.width + this.width) {
            this.x = 0;
        }
    }

    reset() {
        this.x = 0;
    }
}