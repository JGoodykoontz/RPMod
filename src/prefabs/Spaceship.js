class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.point = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.dir = 'RtoL';
    }

    reset() {
        if(this.dir === 'RtoL'){
            this.x = config.width;
        } else {
            this.x = 0;
        }
    }
}