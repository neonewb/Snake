"use strict";

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

class Snake {
    constructor() {
        this.length = 1;
        this.speed = 1;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.body = [{
            id : 1,
            x : 0,
            y : 0,
        }];
        this.head = this.body[0];
    }

    setNextDirection(keyCode) {
        switch (keyCode) {
            case 65:
                if (this.nextDirection === 'right') {
                    break;
                }
                this.nextDirection = 'left';
                break;
            case 68:
                if (this.nextDirection === 'left') {
                    break;
                }
                this.nextDirection ='right';
                break;
            case 83:
                if (this.nextDirection === 'up') {
                    break;
                }
                this.nextDirection = 'down';
                break;
            case 87:
                if (this.nextDirection === 'down') {
                    break;
                }
                this.nextDirection = 'up';
                break;
            case 32:
                    this.speed = 0;
                break;  
            default:
                break;
        }
    }

    upSpeed() {

    }

    moveParts(){
        for (let i = this.body.length; i > 1; i--) {
            this.body[i-1].x = this.body[i - 2].x;
            this.body[i-1].y = this.body[i - 2].y;
        }
    }

    move() {
        if (this.nextDirection === 'up' || this.nextDirection === 'down') {
            if (this.head.x % 20 === 0) {
                this.direction = this.nextDirection;
            }
        }
        if (this.nextDirection === 'right' || this.nextDirection === 'left') {
            if (this.head.y % 20 === 0) {
                this.direction = this.nextDirection;
            }
        }
        switch (this.direction) {
            case 'right':
                this.moveParts();
                this.head.x += this.speed;
                break;
            case 'left':
                this.moveParts();
                this.head.x -= this.speed;
                break;
            case 'down':
                this.moveParts();
                this.head.y += this.speed;
                break;
            case 'up':
                this.moveParts();
                this.head.y -= this.speed;
                break;
            default:
                break;
        }

    }
    
    checkCollision() {
        if (this.head.x === width - 19 || this.head.x < 0) {
            stopGame();
        };
        if (this.head.y === height || this.head.y < 0) {
            stopGame();
        };
        for (let i = 1; i < this.body.length; i++) {
            if (this.head.x === this.body[i].x && this.head.y === this.body[i].y) {
                stopGame();
            }            
        }
    }

    eatApple() {
        if (this.head.x === apple.x && this.head.y === apple.y) {
            this.length++;
            for (let i = 0; i < 20; i++) {
                this.body.push({
                    id : this.length,
                })
            }
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
        document.getElementById('body').addEventListener('keydown', event => {
            let keyCode = event.keyCode;
            self.setNextDirection(keyCode);
        });

        let ongoingTouches = new Array();
        function copyTouch(touch) {
            return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
        }
        function ongoingTouchIndexById(idToFind) {
            for (var i = 0; i < ongoingTouches.length; i++) {
              var id = ongoingTouches[i].identifier;
              
              if (id == idToFind) {
                return i;
              }
            }
            return -1;    // not found
        }

        canvas.addEventListener("touchstart", handleStart, false);
        canvas.addEventListener("touchend", handleEnd, false);
        canvas.addEventListener("touchcancel", handleCancel, false);
        canvas.addEventListener("touchmove", handleMove, false);

        function handleStart(evt) {
            evt.preventDefault();
            console.log("touchstart.");
            var el = document.getElementsByTagName("canvas")[0];
            var ctx = el.getContext("2d");
            var touches = evt.changedTouches;
 
            for (var i = 0; i < touches.length; i++) {
                console.log("touchstart:" + i + "...");
                ongoingTouches.push(copyTouch(touches[i]));
                var color = 'Black';
                console.log("touchstart:" + i + ".");
            }
        }
        function handleMove(evt) {
            evt.preventDefault();
            var el = document.getElementsByTagName("canvas")[0];
            var ctx = el.getContext("2d");
            var touches = evt.changedTouches;
          
            for (var i = 0; i < touches.length; i++) {
              var color = 'Black';
              var idx = ongoingTouchIndexById(touches[i].identifier);
          
              if (idx >= 0) {
                console.log("continuing touch "+idx);

                console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");

                console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");

                
                if(ongoingTouches[idx].pageY < touches[i].pageY) {
                    snake.setNextDirection(83)
                }
                if(ongoingTouches[idx].pageY > touches[i].pageY) {
                    snake.setNextDirection(87)
                }
                if(ongoingTouches[idx].pageX < touches[i].pageX) {
                    snake.setNextDirection(68)
                }
                if(ongoingTouches[idx].pageX > touches[i].pageX) {
                    snake.setNextDirection(65)
                }

                ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
                console.log(".");
              } else {
                console.log("can't figure out which touch to continue");
              }
            }
        }
        function handleEnd(evt) {
            evt.preventDefault();
            console.log("touchend");
            var el = document.getElementsByTagName("canvas")[0];
            var ctx = el.getContext("2d");
            var touches = evt.changedTouches;
          
            for (var i = 0; i < touches.length; i++) {
              var color = 'Black';
              var idx = ongoingTouchIndexById(touches[i].identifier);
          
              if (idx >= 0) {
                ongoingTouches.splice(idx, 1);  // remove it; we're done
              } else {
                console.log("can't figure out which touch to end");
              }
            }
        }
        function handleCancel(evt) {
            evt.preventDefault();
            console.log("touchcancel.");
            var touches = evt.changedTouches;
            
            for (var i = 0; i < touches.length; i++) {
              ongoingTouches.splice(i, 1);  // remove it; we're done
            }
        }
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
    document.getElementById('scores').innerHTML = 'Scores: ' + score;
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
    }, 5);
    document.getElementById('restart').style.display = "none";
    document.getElementById('gameOver').innerHTML = '';
    document.getElementById('scores').innerHTML = '';
}

function stopGame() {
    clearInterval(intervalId);
    document.getElementById('gameOver').innerHTML = 'Game Over!';
    document.getElementById('restart').style.display = "block";
    document.getElementById('restart').addEventListener('click', startGame);
}

let snake;
let apple;
let intervalId;
startGame();


