"use strict";

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

class Snake {
    constructor() {
        this.length = 2;
        this.speed = 1;
        this.direction = 'right';
        this.lastDirection = 'right';
        this.body = [{
            id : 1,
            x : 0,
            y : 0,
        }, {
            id : 2,
            x : 0,
            y : 0,
        }];
    }

    turnInterval(direction) {
        let intervalId = setInterval(() => {
            if (direction === 'up' || direction === 'down') {
                if (this.body[0].x % 20 === 0) {
                    this.direction = direction;
                    clearInterval(intervalId);
                }
            }
            if (direction === 'right' || direction === 'left') {
                if (this.body[0].y % 20 === 0) {
                    this.direction = direction;
                    clearInterval(intervalId);
                }
            }
        }, 1);
    }

    setDirection(keyCode) {
        switch (keyCode) {
            case 65:
                if (this.direction === 'right') {
                    break;
                }
                this.turnInterval('left');
                break;
            case 68:
                if (this.direction === 'left') {
                    break;
                }
                this.turnInterval('right');
                break;
            case 83:
                if (this.direction === 'up') {
                    break;
                }
                this.turnInterval('down');
                break;
            case 87:
                if (this.direction === 'down') {
                    break;
                }
                this.turnInterval('up');
                break;
            case 32:
                if (this.direction !== 'stop') {
                    this.lastDirection = this.direction;
                    this.direction = 'stop';
                } else {
                    this.direction = this.lastDirection;
                    this.speed = 1;
                }
                break;  
            default:
                break;
        }
    }

    upSpeed() {

    }

    moveParts(direction){
        for (let i = this.body.length; i > 1; i--) {
            switch (direction) {
                case 'right':
                    this.body[i-1].x = this.body[i - 2].x - 19;
                    this.body[i-1].y = this.body[i - 2].y;
                    break;
                case 'left':
                    this.body[i-1].x = this.body[i - 2].x + 19;
                    this.body[i-1].y = this.body[i - 2].y;
                    break;
                case 'down':
                    this.body[i-1].x = this.body[i - 2].x;
                    this.body[i-1].y = this.body[i - 2].y - 19;
                    break;
                case 'up':
                    this.body[i-1].x = this.body[i - 2].x;
                    this.body[i-1].y = this.body[i - 2].y + 19;
                    break;
                default:
                    break;
            }

        }
    }

    move() {
        switch (this.direction) {
            case 'right':
                this.moveParts('right');
                this.body[0].x += this.speed;
                break;
            case 'left':
                this.moveParts('left');
                this.body[0].x -= this.speed;
                break;
            case 'down':
                this.moveParts('down');
                this.body[0].y += this.speed;
                break;
            case 'up':
                this.moveParts('up');
                this.body[0].y -= this.speed;
                break;
            case 'stop':
                this.speed = 0;
                break;
            default:
                break;
        }

    }
    
    checkCollision() {
        if (this.body[0].x === width || this.body[0].x < 0) {
            stopGame();
        };
        if (this.body[0].y === height || this.body[0].y < 0) {
            stopGame();
        };
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                stopGame();
            }            
        }
    }

    eatApple() {
        if (this.body[0].x === apple.x && this.body[0].y === apple.y) {
            this.length++;
            this.body.push({
                id : this.length,
            })
            apple = new Apple();
            updateScores();
        }
    }

    draw() {
        ctx.fillStyle = 'Green';
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x, this.body[i].y, 20, 20)
        }
    }

    listenKey() {
        let self = this;
        $('body').keydown(function (event) {
            let keyCode =  event.keyCode;
            self.setDirection(keyCode);
        });
    }
}

class Apple {
    constructor() {
        this.x = Math.floor(Math.random() * width / 20) * 20;
        this.y = Math.floor(Math.random() * height / 20) * 20;
    }

    draw() {
        ctx.fillStyle = 'Red';
        ctx.fillRect(this.x, this.y, 20, 20);
    }

}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function drawBorder() {
    ctx.strokeStyle = 'Black';
    ctx.strokeRect(0, 0, width, height);
}

function drawBlocks() {
    ctx.fillStyle = 'rgb(63, 191, 63, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(63, 191, 63, 0.2)';
    for (let i = 0; i < width; i += 40) {
        for (let j = 0; j < height; j += 40) {
            ctx.fillRect(j, i, 20, 20);
        }
    }
    for (let i = 20; i < width; i += 40) {
        for (let j = 20; j < height; j += 40) {
            ctx.fillRect(j, i, 20, 20);
        }
    }
}


function updateScores() {
    let score = snake.length;
    $('#scores').text('Счёт: ' + score);
}

function gameCycle() {
    clearCanvas();
    drawBlocks();
    drawBorder();
    snake.move();
    snake.checkCollision();
    snake.eatApple();
    apple.draw();
    snake.draw();
    console.log('game cycle');
}

function startGame() {
    snake = new Snake();
    apple = new Apple();
    snake.listenKey();
    intervalId = setInterval(function() {
        gameCycle();
    }, 7);
}

function stopGame() {
    clearInterval(intervalId);
    $('#gameOver').text('Game Over!');
}

let snake;
let apple;
let intervalId;
startGame();


