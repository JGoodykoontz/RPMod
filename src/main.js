//
//  Created by: Jacquelyn Goodykoontz
//  Title: Harpoon
//  Date Completed: 04/17/2022
//  Time Spent: > 10 hours
//
//  Points:
//      - 60 points for aesthetic/theme redesign. All assets were made by me
//      - 30 points for simultaneous two player
//      - 10 points for parallax scrolling
//      - 10 points for new title screen
//
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

