const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";



const birdSize = [51, 36];
const pipeWidth = 78;
const pipeGap = 200;
const speed = 0.5;
const gravity = 1.5;
const jump = -11.5;
const cTenth = (canvas.width / 10);

let birdY = (canvas.height / 2) - (birdSize[1] / 2);
let flight = jump;
let pipes = [];
let index = 0;
let currentScore = 0;
let bestScore = 0;
let gamePlaying = false;
let birdX = cTenth;
let fly = new Audio();
let score_audio = new Audio();

fly.src = "sound/fly.mp3";
score_audio.src = "sound/score.mp3"


const img = new Image();
img.src = imgURL;

const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  birdY = (canvas.height / 2) - (birdSize[1] / 2);
  flight = jump;
  currentScore = 0;
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const checkCollision = () => {
  for (let i = 0; i < pipes.length; i++) {
    const pipeX = pipes[i][0];
    const pipeY = pipes[i][1];

    if (
      (birdY < pipeY && birdX + birdSize[0] > pipeX && birdX < pipeX + pipeWidth) ||
      (birdY + birdSize[1] > pipeY + pipeGap && birdX + birdSize[0] > pipeX && birdX < pipeX + pipeWidth)
    ) {
      gamePlaying = false;
      if (currentScore > bestScore) {
        bestScore = currentScore;
      }
      setup();
      break;
    }
  }
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    birdJump();
    fly.play();
  }
});

const birdJump = () => {
  flight = jump;
};

const render = () => {
  index += 0.3;

  
 

  const backgroundX = -((index * speed) % canvas.width);
  const backgroundSource = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const backgroundPartOneResult = {
    x: backgroundX + canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const backgroundPartTwoResult = {
    x: backgroundX,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  ctx.drawImage(
    img,
    backgroundSource.x,
    backgroundSource.y,
    backgroundSource.width,
    backgroundSource.height,
    backgroundPartOneResult.x,
    backgroundPartOneResult.y,
    backgroundPartOneResult.width,
    backgroundPartOneResult.height
  );

  ctx.drawImage(
    img,
    backgroundSource.x,
    backgroundSource.y,
    backgroundSource.width,
    backgroundSource.height,
    backgroundPartTwoResult.x,
    backgroundPartTwoResult.y,
    backgroundPartTwoResult.width,
    backgroundPartTwoResult.height
  );

  if (gamePlaying) {
    birdY += flight;
    flight += gravity;

    const birdSource = {
      x: 432,
      y: Math.floor((index % 9) / 3) * birdSize[1],
      width: birdSize[0],
      height: birdSize[1],
    };

    ctx.drawImage(
      img,
      birdSource.x,
      birdSource.y,
      birdSource.width,
      birdSource.height,
      cTenth,
      birdY,
      birdSize[0],
      birdSize[1]
    );

    for (let i = 0; i < pipes.length; i++) {
      const pipeX = pipes[i][0];
      const pipeY = pipes[i][1];

      // Draw top pipe
      const topPipeSource = {
        x: 432,
        y: 588 - pipeY,
        width: pipeWidth,
        height: pipeY,
      };

      const topPipeResult = {
        x: pipeX,
        y: 0,
        width: pipeWidth,
        height: pipeY,
      };

      ctx.drawImage(
        img,
        topPipeSource.x,
        topPipeSource.y,
        topPipeSource.width,
        topPipeSource.height,
        topPipeResult.x,
        topPipeResult.y,
        topPipeResult.width,
        topPipeResult.height
      );

      // Draw bottom pipe
      const bottomPipeSource = {
        x: 432 + pipeWidth,
        y: 108,
        width: pipeWidth,
        height: canvas.height - pipeY + pipeGap,
      };

      const bottomPipeResult = {
        x: pipeX,
        y: pipeY + pipeGap,
        width: pipeWidth,
        height: canvas.height - pipeY + pipeGap,
      };

      ctx.drawImage(
        img,
        bottomPipeSource.x,
        bottomPipeSource.y,
        bottomPipeSource.width,
        bottomPipeSource.height,
        bottomPipeResult.x,
        bottomPipeResult.y,
        bottomPipeResult.width,
        bottomPipeResult.height
      );

      // Check collision
      if (
        birdY + birdSize[1] > pipeY + pipeGap &&
        birdX + birdSize[0] > pipeX &&
        birdX < pipeX + pipeWidth
      ) {
        gamePlaying = false;
        if (currentScore > bestScore) {
          bestScore = currentScore;
        }
        setup();
        score_audio.play();
        return;
      }

      if (
        birdY + birdSize[1] > pipeY + pipeGap &&
        birdX + birdSize[0] > pipeX &&
        birdX < pipeX + pipeWidth
      ) {
        gamePlaying = false;
        if (currentScore > bestScore) {
          bestScore = currentScore;
        }
        setup();
        break;
      }
      if (birdY + birdSize[1] >= canvas.height) {
        gamePlaying = false;
        if (currentScore > bestScore) {
          bestScore = currentScore;
        }
        setup();
        score_audio.play();
      }

      // Update current score
      if (pipeX + pipeWidth < cTenth && pipeX + pipeWidth + speed >= cTenth) {
        currentScore++;
      }

      // Move pipes
      pipes[i][0] -= speed;

      // Create new pipe
      if (pipes[i][0] + pipeWidth <= 0) {
        pipes[i][0] = canvas.width;
        pipes[i][1] = pipeLoc();
      }
    }
  } else {
    const birdSource = {
      x: 432,
      y: Math.floor((index % 9) / 3) * birdSize[1],
      width: birdSize[0],
      height: birdSize[1],
    };

    const birdResult = {
      x: (canvas.width / 2) - (birdSize[0] / 2),
      y: birdY,
      width: birdSize[0],
      height: birdSize[1],
    };

    ctx.drawImage(
      img,
      birdSource.x,
      birdSource.y,
      birdSource.width,
      birdSource.height,
      birdResult.x,
      birdResult.y,
      birdResult.width,
      birdResult.height
    );
    
    
    ctx.font = "bold 30px courier";
    ctx.fillText(`Best score: ${bestScore}`, 85, 245);
    ctx.fillText("Click to play", 90, 535);
   

  }

  window.requestAnimationFrame(render);
};

const startGame = () => {
  if (!gamePlaying) {
    gamePlaying = true;
    setup();
    render();
  }
};

document.addEventListener("click", startGame);
window.addEventListener("space", (e) => {
  if (e.code === 32 || e.code === 38) {
    startGame();
    e.preventDefault();
  }
});


setup();
img.onload = render;
