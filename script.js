//when website loads
document.addEventListener('DOMContentLoaded', () => {
    playMusic();
});

//html elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// static variables
const width = canvas.width;
const height =canvas.height

//audios
//function to play correct audio
function playMusic() {
    var music = new Audio('assets/music.mp3');
    music.play();
};
// build play area
ctx.fillStyle ="black";
ctx.fillRect(0,0,width,height);

// draw the current state of the canvas
function draw()
{
// draw/redraw play area
    ctx.fillStyle ="grey";
    ctx.fillRect(0,0,width,height);

// draw/redraw ball
    ctx.fillStyle="white";
    ctx.fillRect(ball_move.x,ball_move.y,ball_size,ball_size);

// --draw paddle--
// draw left paddle
ctx.fillStyle = "green";
    ctx.fillRect(paddle_offset,left_paddle_top,paddle_width,paddle_height);

    ctx.fillStyle = "red";
    ctx.fillRect((width - paddle_offset - paddle_width),right_paddle_top,paddle_width,paddle_height);



//draw score 
ctx.fillStyle = "white";
ctx.font = "60px monospace";
ctx.textAlign = "left"; 

ctx.fillText(leftScore.toString(), 100, 50); 
ctx.textAlign = "right"; 

ctx.fillText(rightScore.toString(), width - 100, 50); 

if(game_over){
    ctx.fillStyle = "white";
    ctx.font = "60px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", width / 2, height / 2);
    }
}
var game_over = false;
var leftScore = 0;
var rightScore = 0;


//draw game over





// -------BALL-----------
// (global) dictate the ball size
const ball_size = 20;
// (global) dictates starting position of the ball
var ball_move = { x:70 , y:30 }

// (global) horizontal nand vertical rate of change
var x_speed = 10;
var y_speed = 8;

//start bawl
function init_ball(){
    ball_move = {x:10 , y:40};
    x_speed = 10;
    y_speed = 8;
}


//update the ball's current xy
function update_ball()
{
    ball_move.x += x_speed;
    ball_move.y += y_speed;
    track_ball();
}



function check_collide()
{

    
// (Local) ball object to track the sides of the ball
    var ball = {
        left: ball_move.x,
        right: ball_move.x + ball_size,
        top: ball_move.y,
        bottom: ball_move.y + ball_size
    }

    //left paddle obj
    var left_paddle = {
        left: paddle_offset,
        right: paddle_offset + paddle_width,
        top: left_paddle_top,
        bottom: left_paddle_top + paddle_height,
    }
    //right paddle obj
    var right_paddle = {
        left: width - paddle_offset - paddle_width,
        right: width - paddle_offset,
        top: right_paddle_top,
        bottom: right_paddle_top + paddle_height,
    }


// if the ball hits the left/right side of the canvas
    if(ball.left < 0 || ball.right > width)
    {
// reverse the travel direction
        init_ball();
    };

if(leftScore === 10 || rightScore === 10){
    game_over = true;
    return(playMusic());
}

// if the ball hits the top/ bottom side of the canvas
    if(ball.top < 0 || ball.bottom > height)
    {
// reverse the travel direction

    y_speed = -y_speed
    }

if(ball.left < 0){
    rightScore++
}
if(ball.right > width){
    leftScore++
}



    if (check_paddle_collide(ball, left_paddle)){
        let distanceFromTop = ball.top - left_paddle_top;
        let distanceFromBottom = left_paddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        x_speed = Math.abs(x_speed);
        
    };


    if (check_paddle_collide(ball, right_paddle)){
        let distanceFromTop = ball.top - right_paddle_top;
        let distanceFromBottom = right_paddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        y_speed = Math.abs(y_speed);
    };    


}

//gameplay




//check to see if the ball collides with the edges of the canvas
function adjustAngle(distanceFromTop, distanceFromBottom){
    if (distanceFromTop < 0){
        //if ball hits near top of paddle, reduce ySpeed
        y_speed -= 0.5;
    } else if (distanceFromBottom < 0){
        //if ball hits near bottom of paddle, increase ySpeed
        y_speed += 0.5
    }
}




        function check_paddle_collide(chk_ball, chk_paddle){
            
            if(chk_ball.left < chk_paddle.right &&
                chk_ball.right > chk_paddle.left && 
                chk_ball.top < chk_paddle.bottom &&
                chk_ball.bottom > chk_paddle.top)
                {
                    x_speed = -x_speed
                }
            


        }




//~~~~~~PADDLE~~~~~~

const paddle_width = 10; 
const paddle_height = 150;
const paddle_offset = 15;

var left_paddle_top = 30;
var right_paddle_top = 30;
var paddle_modifier = 5;

var paddle_speed = 10;

function track_ball(){
    //create condsensed ball that is only the top and bottom
    var ball ={
        top: ball_move.y,
        bottom: ball_move.y + ball_size,
    };
//create condsensed paddle that is only the top and bottom
    var left_paddle = {
        top: left_paddle_top,
        bottom: left_paddle_top + paddle_height
    }

    if (ball.top < left_paddle.top){
        left_paddle_top -= paddle_speed * Math.random() + paddle_modifier;
    }

    if (ball.bottom > left_paddle.bottom){
        left_paddle_top += paddle_speed * Math.random(); + paddle_modifier;
    }
}

// gameplay
document.addEventListener("mousemove", (event) =>{
    //tracks offset of mouse and moves paddle with y coordinate of mouse
    right_paddle_top = event.offsetY;
})



//main game loop
function game_loop()
{
    if(!game_over){
        check_collide();
        setTimeout(game_loop, 20);
    }
    draw();
    update_ball();
};

// call main loop to start the game
game_loop();