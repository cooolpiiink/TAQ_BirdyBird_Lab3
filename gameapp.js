// constants
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var birdImage = document.getElementById('bird');
var crosshairImage = document.getElementById('crosshair');
var bulletImage = document.getElementById('bullet');
var myScore = 0;

var crosshairSpeed = 5;
var bulletSpeed = 6;
var crosshairWidth = 40;
var crosshairHeight = 25;
var birdSpeedX = -2;
var birdWidth = 40;
var birdHeight = 25;
var crosshairWidth = 40;
var crosshairHeight = 25;
var birdSpeedX = -2;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function GameObject(type, startX, startY, deltaX, deltaY, width, height) {
    this.img = birdImage;
    if (type === 'crosshair') {
        this.img = crosshairImage;
    } else if (type === 'bullet') {
        this.img = bulletImage;
    }
    this.gameOb = {
        img: this.img,
        right: startX,
        top: startY,
        width:width,
        height: height,
    };

    this.move = function() {
        var newX = this.gameOb.right - deltaX;
        var newY = this.gameOb.top + deltaY;
        this.gameOb.right = newX;
        this.gameOb.top = newY;
    };
    this.hit = function(){
        var bagoX = this.gameOb.right;
        var bagoY = this.gameOb.top;
        this.gameOb.right = bagoX;
        this.gameOb.top = bagoY;
    };
    this.addToCanvas = function() {
        ctx.drawImage(this.gameOb.img, this.gameOb.right, this.gameOb.top,
            this.gameOb.width, this.gameOb.height);
    };
};

var birds = [];
var crosshair = null;
var bullets = [];
function addbird(number) {
    var startX = 0;
    var startY = getRandomInt(0, 500 - birdHeight);
    var deltaX = birdSpeedX;
    var deltaY = 0;
    for (var i=0; i < number; i++) {
        var gameOb = new GameObject(
            'bird', startX, startY, deltaX, deltaY, birdWidth, birdHeight);
        startX += birdWidth + 10;
        birds.push(gameOb);
        gameOb.addToCanvas();
    };
};

function startAddingbird() {
    addbird(1);
    setTimeout(function() {
        startAddingbird();
    }, 700);
};

function movebirds() {
    var toRemove = [];
    for (var i = birds.length - 1; i >= 0 ; i--) {
        birds[i].move();
        if (birds[i].gameOb.left - birdWidth > 0) {
            birds.splice(i, 1);
        }
    }

    for (var i = bullets.length - 1; i >= 0; i--) {
        bullets[i].hit();
        var hasRemove = false;
        for (var j=birds.length - 1; j >= 0; j--) {
           if (i < bullets.length) {
                if (checkHit(bullets[i].gameOb, birds[j].gameOb)) {
                    bullets.splice(i, 1);
                    birds.splice(j, 1);
                    hasRemove = true;
                    myScore++;
                }
            }
        }
        if (!hasRemove) {
            if (bullets[i].gameOb.right + 10 < 1000) {
                bullets.splice(i, 1);
            }
        }
    }
};

function repaint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movebirds();
    crosshair.addToCanvas();
    for (var i = 0; i < birds.length; i++) {
        birds[i].addToCanvas();
        // if (checkCollision(crosshair.gameOb, birds[i].gameOb)) {
        //     alert('GAMEOVER');
        //     return;
        //     setTimeout(location.reload, 500);
        // }
    }
    for (var i=0; i < bullets.length; i++) {
        bullets[i].addToCanvas();
    }
    setTimeout(function() {
        repaint();
        drawScore();
    }, 20);
};
function GameOver(){
    alert('GAMEOVER');
    document.location.reload();
};

function addcrosshair() {
    crosshair = new GameObject('crosshair', 500, 250, 0, 0, crosshairWidth, crosshairHeight);
    crosshair.addToCanvas();
};

function addBullet(startX, startY) {
    var bullet = new GameObject('bullet', startX, startY, bulletSpeed, 0, 10, 10);
    bullets.push(bullet);
};

function drawScore() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + myScore, 400, 485);
};

function movecrosshair(direction) {
    if (direction === 115 && crosshair.gameOb.top - crosshairSpeed > 0) { // up
        crosshair.gameOb.top -= crosshairSpeed;
    }  else if (direction === 119 && crosshair.gameOb.top + crosshairHeight + crosshairSpeed <= 500) {
        crosshair.gameOb.top += crosshairSpeed;
    }   else if (direction === 97 && crosshair.gameOb.right + crosshairWidth + crosshairSpeed <= 1000) {
        crosshair.gameOb.right += crosshairSpeed;
    }   else if (direction === 100 && crosshair.gameOb.right - crosshairSpeed > 0) {
        crosshair.gameOb.right -= crosshairSpeed;
    }
};

 function checkHit(bullet1, bird1) {
     if (bullet1.right < bird1.right + bird1.width  && bullet1.right + bullet1.width  > bird1.right &&
        bullet1.top < bird1.top + bird1.height && bullet1.top + bullet1.height > bird1.top) {
         return true;
     }
     return false;
 };

function allowcrosshairMovement() {
    document.onkeypress = function(e) {
        if (e.keyCode === 32) {
            addBullet(crosshair.gameOb.right + (crosshairWidth/2) - 2 , crosshair.gameOb.top + (crosshairHeight / 2) - 5);
        }
        movecrosshair(e.keyCode);
    };
};

function start() {
    startAddingbird();
    addcrosshair();
    repaint();
    allowcrosshairMovement();
    setTimeout(function() {
        GameOver();
    }, 30000);
};

start();
