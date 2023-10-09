//board
let board;
let boardWidth=450;
let boardHeight=720;
let context;

//ponyo
let ponyoWidth=90;
let ponyoHeight=90;
let ponyoX=boardWidth/2-ponyoWidth/2;
let ponyoY=boardHeight*7/8-ponyoHeight;
let ponypRightImg;
let ponyoLeftImg;

let ponyo={
    img: null,
    x: ponyoX,
    y: ponyoY,
    width: ponyoWidth,
    height: ponyoHeight
}

//physics
let velocityX=0;
let velocityY=0;       //ponyo jump sped
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;          

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

//score
let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload=function(){
    board=document.getElementById('board');
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d");// used for drawing on the board
    
    //draw ponyo
    //context.fillstyle="green";
    //context.fillRect(ponyo.x,ponyo.y,ponyo.width,ponyo.height)
    
    //load.images
    ponyoLeftImg=new Image();
    ponyoLeftImg.src="./ponyo_left.png"
    ponyo.img=ponyoLeftImg;
    ponyoLeftImg.onload=function(){
        context.drawImage(ponyo.img,ponyo.x,ponyo.y,ponyo.width,ponyo.height);
    }

    ponyoRightImg=new Image();
    ponyoRightImg.src="./ponyo_right.png"

    platformImg = new Image();
    platformImg.src="./green_platform.png"

    velocityY=initialVelocityY;

    placePlatforms();

    requestAnimationFrame(update);
    document.addEventListener("keydown",movePonyo);

    board.addEventListener('touchstart',handleTouchStart,false);
    board.addEventListener('touchend',handleTouchEnd,false);
} 

function update(){
      requestAnimationFrame(update);
      if(gameOver){
        return;
      }
      context.clearRect(0,0,board.width,board.height);

      ponyo.x += velocityX;
      if(ponyo.x > boardWidth){
        ponyo.x=0;
      }
      else if(ponyo.x + ponyo.width < 0){
        ponyo.x=boardWidth;
      }
      velocityY += gravity;
      ponyo.y += velocityY;
      if (ponyo.y > board.height){
        gameOver = true;
      }
      //ponyo
      context.drawImage(ponyo.img,ponyo.x,ponyo.y,ponyo.width,ponyo.height);


      //platforms
      for (let i = 0;  i < platformArray.length; i++){
      let platform = platformArray[i];
      if (velocityY < 0 && ponyo.y < boardHeight*3/4){
        platform.y -= initialVelocityY; //slide platforms down
      }
      if (detectCollision(ponyo,platform) && velocityY >= 0){
        velocityY = initialVelocityY;
      }
    context.drawImage(platform.img,platform.x,platform.y,platform.width,platform.height);
      }
      
      //clear platforms and add new platforms
      while(platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift();//removes first element from the array
        newPlatform(); // replace with new platform on top
      }

      //score 
      updateScore();
      context.fillStyle = "black";
      context.font = "16px sans-serif";
      context.fillText(score, 5, 20);

      if(gameOver){
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth/7, boardHeight*7/8 );
      }
    }

function movePonyo(e){
    if(e.code=="ArrowRight" || e.code=="keyD")//move right
    {
        velocityX=4;
        ponyo.img=ponyoRightImg;
    }
    else if (e.code=="ArrowLeft" || e.code=="keyA")//move left
    {
        velocityX=-4;
        ponyo.img=ponyoLeftImg;
    }
    else if(e.code == "Space" && gameOver){
        //reset
        let ponyo={
            img: ponyoRightImg,
            x: ponyoX,
            y: ponyoY,
            width: ponyoWidth,
            height: ponyoHeight
        }

        velocityX =0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore =0;
        gameOver = false;
        placePlatforms();
        
    }

}

function placePlatforms(){
    platformArray = [];

    //starting platforms
    let platform={
        img: platformImg,
        x:   boardWidth/2,
        y:  boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);

     //platform={
     //   img: platformImg,
     //   x:   boardWidth/2,
     //   y:  boardHeight - 150,
     //   width: platformWidth,
     //   height: platformHeight
    //}

    //platformArray.push(platform);

    for(let i=0; i < 6; i++){
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75*i - 150,
            width: platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);
    }
}
 function newPlatform(){
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img: platformImg,
            x: randomX,
            y: -platformHeight,
            width: platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);
 }

function detectCollision(a,b){
    return a.x < b.x  + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x  &&   // a's top right corner passes b's top left corner
           a.y < b.y  + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;     // a's bottom left corner passes b's top left corner
}

function updateScore(){
    let points = Math.floor(50*Math.random());
    if(velocityY < 0) {//negative going up
      maxScore += points;
      if(score < maxScore){
        score = maxScore;
      }
    }
    else if(velocityY >= 0){
        maxScore -= points;
    }
}

function handleTouchStart(event){
   if(event.touches.length === 1){
    touchStartX = event.touches[0].pageX;
   }
}

function handleTouchEnd(event){
  if(event.changedTouches.length === 1){
    let touchEndX = event.changedTouches[0].pageX;
    let touchDiff = touchEndX - touchStartX;

    if(touchDiff > 0){
      //Swipe right
      velocityX = 4;
      ponyo.img = ponyoRightImg;
    }else if(touchDiff < 0){
      //swipe left
      velocityX = -4;
      ponyo.img = ponyoLeftImg;
    }
  }
  event.preventDefault();
}


