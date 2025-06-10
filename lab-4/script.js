const GRID_SIZE = 30;
const CELL_SIZE = 20;
const MAX_SNAKE_LENGTH = GRID_SIZE * GRID_SIZE;

let snake = [{x: 15, y: 15}];
let direction = {x: 1, y: 0};
let food = generateFood();
let snakeDivs = [];
let foodDiv;
let score = 0;
let gameRunning = true;

const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');

for (let i = 0; i < MAX_SNAKE_LENGTH; i++) {
  let div = document.createElement('div');
  div.className = 'snake-segment';
  div.style.display = 'none';
  gameBoard.appendChild(div);
  snakeDivs.push(div);
}

foodDiv = document.createElement('div');
foodDiv.className = 'food';
gameBoard.appendChild(foodDiv);

function initGame() {
  snake = [{x: 15, y: 15}];
  direction = {x: 1, y: 0};
  food = generateFood();
  score = 0;
  document.getElementById('score').textContent = 'Score: 0';
  gameRunning = true;
  render();
  document.addEventListener('keydown', handleKeydown);
  gameLoop();
  restartBtn.style.display = 'none';
}

function gameLoop() {
  if (!gameRunning) return;
  setTimeout(() => {
    update();
    render();
    requestAnimationFrame(gameLoop);
  }, 100);
}

function update() {
  let head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver();
    return;
  }
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
  } else {
    snake.pop();
  }
}

function render() {
  snake.forEach((pos, index) => {
    let div = snakeDivs[index];
    div.style.left = pos.x * CELL_SIZE + 'px';
    div.style.top = pos.y * CELL_SIZE + 'px';
    div.style.display = 'block';
    if (index === 0) div.classList.add('snake-head');
    else div.classList.remove('snake-head');
  });
  for (let i = snake.length; i < snakeDivs.length; i++) {
    snakeDivs[i].style.display = 'none';
  }
  foodDiv.style.left = food.x * CELL_SIZE + 'px';
  foodDiv.style.top = food.y * CELL_SIZE + 'px';
}

function generateFood() {
  let pos;
  do {
    pos = {x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE)};
  } while (snake.some(segment => segment.x === pos.x && segment.y === pos.y));
  return pos;
}

function handleKeydown(event) {
  if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowRight':
        if (direction.x !== -1) direction = {x: 1, y: 0};
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) direction = {x: -1, y: 0};
        break;
      case 'ArrowUp':
        if (direction.y !== 1) direction = {x: 0, y: -1};
        break;
      case 'ArrowDown':
        if (direction.y !== -1) direction = {x: 0, y: 1};
        break;
    }
  }
}

function gameOver() {
  gameRunning = false;
  restartBtn.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
  initGame();
});

initGame();