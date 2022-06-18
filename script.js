const canvas = document.querySelector('canvas');

let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 500;

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
    this.jumping = false
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
    if (this.position.y 
        + this.height 
        + this.velocity.y 
        <= canvas.height - 20) {
        this.velocity.y = this.velocity.y  + gravity;
        this.jumping = true
    } else {
        this.velocity.y = 0
        this.jumping = false
    }
};

function Platform() {
    this.position = {
        x:200,
        y: 300
    }
    this.width = 200
    this.height = 20
    this.draw = function() {
        c.fillStyle = 'firebrick'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player();
const platform = new Platform();

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platform.draw();
    console.log('player vel', player.velocity.x)

    // movement logic
    if (keys.left.pressed || keys.right.pressed) {
        if(Math.abs(player.velocity.x) > 15) {
            player.velocity.x -= player.velocity.x /5
            return;
        };
        if (keys.right.pressed) player.velocity.x += 1.4
        if (keys.left.pressed) player.velocity.x += -1.4 
    } else {
        if (player.jumping) {
            player.velocity.x -= player.velocity.x / 10
        } else player.velocity.x -= player.velocity.x / 5
    }
    if (Math.abs(player.velocity.x) < 1.3) player.velocity.x = 0

    // platform position detection TODO: Refactor to handle multiple platforms
    if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
        player.velocity.y = 0
        player.jumping = false
    }
}

animate();

const directions = { UP: 'UP', }

window.addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            // if (Math.abs(player.velocity.x) < 10){
            // }
            break;
        case 68:
            console.log('right')
            keys.right.pressed = true
            // if (Math.abs(player.velocity.x)< 10){
            // }
            break;
        case 83:
            console.log('down')
            player.height = 30
            break;
        case 32:
            console.log('up')
            if (player.jumping === false) {
                player.velocity.y -= 20
                player.jumping = true 
            }
            break;
        default:
            break;
    }
})

window.addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            // if (Math.abs(player.velocity.x) < 10){
            // }
            break;
        case 68:
            console.log('right')
            keys.right.pressed = false
            // if (Math.abs(player.velocity.x) < 10){
            // }
            break;
        case 83:
            console.log('down')
            player.height = 50
            break;
        case 32:
            console.log('up')
            if (player.jumping === true) {
                player.velocity.y -= player.velocity.y /2 + gravity 
            }
            break;
        default:
            break;
    }
})