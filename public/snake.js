const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let score = document.getElementById("score");
let reset = document.getElementById("reset");
let blockSize = 25;
let width = canvas.width;
let height = canvas.height;
let blockWidth = width / blockSize;
let interval;
let food;
let running = false;
let instruction = document.getElementById("instruction");

let createFood = () => {
  food = {
    x: Math.floor(Math.random() * blockWidth) * blockSize,
    y: Math.floor(Math.random() * blockWidth) * blockSize,
  };
};

let snake = {
  x: 0,
  y: 0,
  directionX: blockSize,
  directionY: 0,
  tail: [],
};

let left = () => {
  snake.directionX = -blockSize;
  snake.directionY = 0;
};

let right = () => {
  snake.directionX = blockSize;
  snake.directionY = 0;
};

let up = () => {
  snake.directionX = 0;
  snake.directionY = -blockSize;
};

let down = () => {
  snake.directionX = 0;
  snake.directionY = +blockSize;
};

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, blockSize, blockSize);
}

function drawSnake() {
  ctx.fillStyle = "green";
  ctx.fillRect(snake.x, snake.y, blockSize, blockSize);
  snake.tail.forEach((block) => {
    ctx.fillStyle = "black";
    ctx.fillRect(block.x, block.y, blockSize, blockSize);
  });
}

function updateTail() {
  if (snake.tail.length === 0) return;
  let tempBlock = { x: snake.x, y: snake.y };

  for (let i = snake.tail.length - 1; i > 0; i--) {
    snake.tail[i].x = snake.tail[i - 1].x;
    snake.tail[i].y = snake.tail[i - 1].y;
  }
  snake.tail[0] = tempBlock;
}

function incrementTail() {
  if (snake.tail.length === 0) {
    snake.tail.push({
      x: snake.x - snake.directionX,
      y: snake.y - snake.directionY,
    });
  } else {
    let lastTail = snake.tail[snake.tail.length - 1];
    snake.tail.push({
      x: lastTail.x - snake.directionX,
      y: lastTail.y - snake.directionY,
    });
  }
}

function moveSnake() {
  updateTail();
  snake.x += snake.directionX;
  snake.y += snake.directionY;

  if (snake.x >= width || snake.x < 0 || snake.y >= height || snake.y < 0) {
    displayGameOver();
    console.log("Game Over out of bounds");

    setTimeout(resetGame, 1200);
    return;
  }

  snake.tail.forEach((block) => {
    if (snake.x === block.x && snake.y === block.y) {
      displayGameOver();
      console.log("Game Over hit tail");

      setTimeout(resetGame, 1200);
    }
  });

  if (snake.x === food.x && snake.y === food.y) {
    createFood();
    score.innerText = parseInt(score.innerText) + 1;
    incrementTail();
  }

  ctx.clearRect(0, 0, width, height);
  drawSnake();
  drawFood(); // draw food after clearing the canvas
}

function startGame() {
  running = true;
  instruction.hidden = true;
  clearInterval(interval);
  createFood();
  drawFood();
  interval = setInterval(moveSnake, 150);
}

addEventListener("keydown", (e) => {
  if (e.keyCode === 37) {
    left();
  } else if (e.keyCode === 39) {
    right();
  } else if (e.keyCode === 38) {
    up();
  } else if (e.keyCode === 40) {
    down();
  }
});

function resetGame() {
  clearInterval(interval);
  running = false;
  instruction.hidden = false;
  ctx.clearRect(0, 0, width, height);
  snake.x = 0;
  snake.y = 0;
  snake.directionX = blockSize;
  snake.directionY = 0;
  snake.tail = [];
  score.innerText = 0;
  sendDataToServer();
  drawSnake();
}

function displayGameOver() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over", width / 2, height / 2);
}

// Asynchronous function to send data to the server
async function sendDataToServer() {
  try {
    // Perform the POST request using axios
    const response = await axios.post(
      `http://localhost:3000/save-data?score=${score.innerText}`
    );

    // Log the success response from the server
    console.log("Success:", response.data.message);
    $("#high-score").text(response.data.highScore);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
  }
}
reset.addEventListener("click", resetGame);

addEventListener("keypress", (e) => {
  if (running === false && e.keyCode === 32) {
    startGame();
  }
});

startGame();
