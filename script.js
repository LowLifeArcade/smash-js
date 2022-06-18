const canvas = document.querySelector('canvas');
const container = document.getElementsByClassName('container');

let c = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 600;
// make_base();

// function make_base() {
//     base_image = new Image();
//     base_image.src = './public/laura-vinck-sky.jpeg';
//     base_image.onload = function () {
//         c.drawImage(base_image, 0, 0);
//     };
// }

const gravity = 1;

/**
 * Player class
 */
function Player() {
    this.position = {
        x: 100,
        y: 400,
    };
    this.velocity = {
        x: 0,
        y: 0,
    };
    this.width = 30;
    this.height = 50;
    this.jumping = false;
    this.currentPosition;
    this.downPressed = false;
}

Player.prototype.draw = function () {
    c.fillStyle = 'salmon';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
};

Player.prototype.update = function () {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // landing and jumping logic
    const inAirVertically = this.position.y + this.height + this.velocity.y <= ground.position.y;
    const inAirHorizontally =
        player.position.x + player.width >= ground.position.x &&
        player.position.x <= ground.position.x + ground.width;

    if (inAirVertically) {
        this.velocity.y = this.velocity.y + gravity;
        this.jumping = true;
    } else {
        this.velocity.y = 0;
        this.jumping = false;
    }
};

function Platform({ posX = 200, posY = 300, width = 200, height = 20 } = {}) {
    this.position = {
        x: posX,
        y: posY,
    };
    this.width = width;
    this.height = height;

    this.draw = function () {
        c.fillStyle = 'firebrick';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
}

function Ground({ posX = 100, posY = 580, width, height = 20 } = {}) {
    this.position = {
        x: posX,
        y: posY,
    };
    this.width = width;
    this.height = height;

    this.draw = function () {
        c.fillStyle = 'firebrick';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
}

const player = new Player();
const platform = new Platform({ posX: 200, posY: 400 });
const platform2 = new Platform({ posX: 800, posY: 400 });
const platform3 = new Platform({ posX: 500, posY: 240 });
const ground = new Ground({ width: 1000 });

const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platform.draw();
    platform2.draw();
    platform3.draw();
    ground.draw();

    // logs
    console.log('player current pos', player);
    // console.log('player vel', player.velocity.x)

    // movement logic
    if (keys.left.pressed || keys.right.pressed) {
        if (Math.abs(player.velocity.x) > 15) {
            player.velocity.x -= player.velocity.x / 5;
            return;
        }
        if (keys.right.pressed) player.velocity.x += 1.4;
        if (keys.left.pressed) player.velocity.x += -1.4;
    } else {
        if (player.jumping) {
            player.velocity.x -= player.velocity.x / 10;
        } else player.velocity.x -= player.velocity.x / 5;
    }
    if (Math.abs(player.velocity.x) < 1.3) player.velocity.x = 0;

    // platform position detection TODO: Refactor to handle multiple platforms
    const isOnPlat1 =
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width;
    const isOnPlat2 =
        player.position.y + player.height <= platform2.position.y &&
        player.position.y + player.height + player.velocity.y >= platform2.position.y &&
        player.position.x + player.width >= platform2.position.x &&
        player.position.x <= platform2.position.x + platform2.width;
    const isOnPlat3 =
        player.position.y + player.height <= platform3.position.y &&
        player.position.y + player.height + player.velocity.y >= platform3.position.y &&
        player.position.x + player.width >= platform3.position.x &&
        player.position.x <= platform3.position.x + platform3.width;
    if (isOnPlat1 || isOnPlat2 || isOnPlat3) {
        player.velocity.y = 0;
        player.jumping = false;
    }

    //      // platform position detection TODO: Refactor to handle multiple platforms
    //      const playerOnPlatform =
    //      player.position.y + player.height <= platform.position.y &&
    //      player.position.y + player.height + player.velocity.y >= platform.position.y &&
    //      player.position.x + player.width >= platform.position.x &&
    //      player.position.x <= platform.position.x + platform.width;

    //  // console.log('🚀 ~ file: script.js ~ line 136 ~ animate ~ playerOnPlatform', playerOnPlatform);
    //  const playerOnGround =
    //      player.position.y + player.height <= ground.position.y &&
    //      player.position.y + player.height + player.velocity.y >= ground.position.y &&
    //      player.position.x + player.width >= ground.position.x &&
    //      player.position.x <= ground.position.x + ground.width;

    //  console.log('🚀 ~ file: script.js ~ line 143 ~ animate ~ playerOnGround', playerOnGround);
    //  if (playerOnGround) {
    //      player.velocity.y = 0;
    //      player.jumping = false;
    //  }
    //  if (!playerOnPlatform && !playerOnGround) player.jumping = true;
}

animate();

const directions = { UP: 'UP' };

window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = true;
            // if (Math.abs(player.velocity.x) < 10){
            // }
            break;
        case 68:
            console.log('right');
            keys.right.pressed = true;
            // if (Math.abs(player.velocity.x)< 10){
            // }
            break;
        case 83:
            console.log('down');
            if (player.downPressed === false && player.jumping === false) {
                // TODO: if (playerIsOnGround) return player.currentPosition always equals currentPosition until leaving ground
                player.currentPosition = player.position.y;
                player.downPressed = true;
            }
            player.height = 30;
            break;
        case 32:
            console.log('up');
            if (player.jumping === false) {
                player.velocity.y -= 20;
                player.jumping = true;
            }
            break;
        default:
            break;
    }
});

window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = false;
            // if (Math.abs(player.velocity.x) < 10){
            // }
            break;
        case 68:
            console.log('right');
            keys.right.pressed = false;
            // if (Math.abs(player.velocity.x) < 10){
            // }
            break;
        case 83:
            console.log('down');
            player.height = 50;
            // player.position.y = player.position.y + -10
            if (player.downPressed === true) {
                player.position.y = player.currentPosition;
                player.downPressed = false;
            }
            break;
        case 32:
            console.log('up');
            if (player.jumping === true) {
                player.velocity.y -= player.velocity.y / 2 + gravity;
            }
            break;
        default:
            break;
    }
});
