let config = {
    type: Phaser.CANVAS, 
    width: 640, 
    height: 480,
    scene: [Menu, Play]
};

let keyW, keyA, keyD, keyUP, keyLEFT, keyRIGHT, keySPACE, keyESC;

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let game = new Phaser.Game(config);

