let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let scoreForNextLevel = 100;
let level = 0;
let speed = 1000;
let levelPng;
let scorePng;
let nextPiece;
let Png0;
let Png1;
let gameOverScreen;
let winOrLose = "Playing";
let music = false;
var audio = new Audio('src/soundtrack.mp3');
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth)
.fill(0));

let curTetromino = [[1,0], [0,1], [1,1], [2,1]];
let tetrominos = [];
let tetrominosColors = [ '#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96', '#DC5AE8', '#FF7363'];
let curTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth)
.fill(0));

let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));

let DIRECTIONS = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray(){
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    ctx.scale(1,1);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.width);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(8, 8, 280, 462);

    scorePng = new Image(73,18)
    scorePng.onload = DrawScore;
    scorePng.src = "src/score.png"

    levelPng = new Image(79, 23);
    levelPng.onload = DrawLevel;
    levelPng.src = "src/level.png";
    
    Png0 = new Image(20, 24);
    Png0.onload = Draw0;
    Png0.src = "src/0.png";

    Png0 = new Image(20, 24);
    Png0.onload = Draw0ForLevel;
    Png0.src = "src/0.png";
    
    ctx.fillStyle = 'white';
    ctx.strokeRect(300, 37, 161, 24);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(300, 95, 161, 24);
    
    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}

function DrawScore(){
    ctx.drawImage(scorePng, 353, 15, 60, 15);
}

function DrawLevel(){
    ctx.drawImage(levelPng, 353, 75, 60, 15);
}

function DrawNextPiece(){
    ctx.drawImage(nextPiece, 313, 130, 136, 15);
}
function Draw0(){
    ctx.drawImage(Png0, 375, 41, 17, 16);
}

function Draw0ForLevel(){
    ctx.drawImage(Png0, 375, 99, 17, 16);
}

function Draw1(){
        ctx.drawImage(Png1, 357, 41, 17, 16);
}

function Draw1ForLevel(){
    ctx.drawImage(Png1, 375, 99, 17, 16);
}

function DrawGameOverScreen(){
    ctx.drawImage(gameOverScreen, 60, 150, 350,237);
}

function DrawTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
        if(key.keyCode === 37){
            direction = DIRECTIONS.LEFT;
            let isCollidingWall = HittingTheWall();
            let isCollidingHorizontal = CheckForHorizontalCollision();
            if(!isCollidingWall && !isCollidingHorizontal){
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if(key.keyCode === 39){
            direction = DIRECTIONS.RIGHT;
            let isCollidingWall = HittingTheWall();
            let isCollidingHorizontal = CheckForHorizontalCollision();
            if(!isCollidingWall && !isCollidingHorizontal){
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if(key.keyCode === 40){
            MoveTetraminoDown();
        } else if(key.keyCode === 32){
            RotateTetromino();
        }
    }   
}

function MoveTetraminoDown(){
    direction = DIRECTIONS.DOWN;
    let collision = CheckForVerticalCollision();
    if(!collision){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }      
}

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetraminoDown();
    }
    if(!music){
        audio.play();
        audio.loop = true;
        music = true;
    }
}, speed)

function DeleteTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] =0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos(){
    // Push T 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}
function CreateTetromino(){
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominosColors[randomTetromino];
}

function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTIONS.LEFT){
            return true;
        }else if(newX >= 11 && direction === DIRECTIONS.RIGHT){
            return true;
        }  
    }
    return false;
}

function CheckForVerticalCollision(){
    let tetrominoCopy = curTetromino;
    let collision = false;
 
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
 
        if(direction === DIRECTIONS.DOWN){
            y++;
        }
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        if(startY <= 2){
            winOrLose = "Game Over";
            gameOverScreen = new Image(250, 137);
            gameOverScreen.onload = DrawGameOverScreen;
            gameOverScreen.src = "src/gameOverScreen.png";
            audio.pause();
        } else {
 
            
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
 
            CheckForCompletedRows();
 
            CreateTetromino();
 
            direction = DIRECTIONS.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
 
    }
}

function CheckForHorizontalCollision(){
    var tetrominoCopy = curTetromino;
    var collision = false;

    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;
 
        if (direction == DIRECTIONS.LEFT){
            x--;
        }else if (direction == DIRECTIONS.RIGHT){
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }
 
    return collision;
}

function CheckForCompletedRows(){
    let rowsToDelete = 0;
    let starOfDeletion = 0;
    for(let y = 0; y < gBArrayHeight; y++){
        let completed = true;
        for(let x = 0; x < gBArrayWidth; x++){
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === 'undefined')){
                completed = false;
                break;
            }
        }

        if(completed){
            if(starOfDeletion === 0) starOfDeletion = y;
            rowsToDelete++
            for(let i = 0; i< gBArrayWidth; i++){
               stoppedShapeArray[i][y] = 0;
               gameBoardArray[i][y] = 0;
               let coorX = coordinateArray[i][y].x
               let coorY = coordinateArray[i][y].y
               ctx.fillStyle = 'black';
               ctx.fillRect(coorX, coorY, 21, 21);
            }

        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.font = '19px Conv_Pixeled';
        ctx.fillStyle = 'white';
        ctx.fillText(score.toString(), 538, 55);
        if(score >= 20){
            ctx.fillStyle = 'black';
            ctx.fillRect(320, 40, 140, 19);
            ctx.fillStyle = 'white';
            ctx.fillText(score.toString(), 375, 68);
        }  else if( score == 10){
            Png1 = new Image(20, 25);
            Png1.onload = Draw1;
            Png1.src = "src/1.png";
        }
        MoveAllRowsDown(rowsToDelete, starOfDeletion);
    }

    if(score == scoreForNextLevel){
        level++;
        scoreForNextLevel = scoreForNextLevel * 2;
        ctx.fillStyle = 'black';
        ctx.fillRect(300, 97, 140, 19);
        if(speed > 500){
            speed -= 100;
        }
        ctx.font = '19px Conv_Pixeled';
        ctx.fillStyle = 'white';
        ctx.fillText(level.toString(), 538, 55);
        if(level > 1){
            ctx.fillStyle = 'black';
            ctx.fillRect(300, 97, 140, 19);
            ctx.fillStyle = 'white';
            ctx.fillText(level.toString(), 375, 127);
        } else if(level == 1){
            Png1 = new Image(20, 25);
            Png1.onload = Draw1ForLevel;
            Png1.src = "src/1.png";
        }
    }
}

function MoveAllRowsDown(rowsToDelete, starOfDeletion){
    for(var i = starOfDeletion - 1; i >= 0; i--){
        for(var x = 0; x < gBArrayWidth; x++){
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
            if(typeof square === 'string' ){
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x
                let coorY = coordinateArray[x][y2].y 
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x
                coorY = coordinateArray[x][i].y 
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    } 
}

function RotateTetromino(){
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for(let i =0; i< tetrominoCopy.length; i++){
        curTetrominoBU = [...curTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        newY = x;
        newRotation.push([newX, newY]);       
    }
    DeleteTetromino();
    try{
        curTetromino= newRotation;
        DrawTetromino();
    }
    catch(e){
        if(e instanceof TypeError){
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX(){
    let lastX = 0;
    for(let i = 0; i < curTetromino.length; i++){
        let square = curTetromino[i];
        if(square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}