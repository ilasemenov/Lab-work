const size = 4;
let tiles = [];
let emptyPos = { x: 3, y: 3 };
let moveCount = 0;

const gameContainer = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

function createSVG(number) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "80");
    svg.setAttribute("height", "80");

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", "80");
    rect.setAttribute("height", "80");
    rect.setAttribute("fill", "#4CAF50");
    rect.setAttribute("rx", "10");
    rect.setAttribute("ry", "10");
    svg.appendChild(rect);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "50%");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "24");
    text.setAttribute("fill", "#fff");
    text.textContent = number;
    svg.appendChild(text);

    return svg.outerHTML;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function init() {
    tiles = [];
    for (let i = 1; i <= 15; i++) {
        tiles.push(i);
    }
    tiles.push(0);
    do {
        shuffle(tiles);
    } while (!isSolvable(tiles));

    // Находим позицию пустой клетки
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === 0) {
            emptyPos.x = i % size;
            emptyPos.y = Math.floor(i / size);
            break;
        }
    }
    moveCount = 0;
    updateScore();
    render();
}

// Проверка, решаемая ли головоломка
function isSolvable(array) {
    let invCount = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] && array[j] && array[i] > array[j]) invCount++;
        }
    }
    const emptyRow = Math.floor(array.indexOf(0) / size);
    if (size % 2 === 1) {
        return invCount % 2 === 0;
    } else {
        return (invCount + emptyRow) % 2 === 0;
    }
}

function render() {
    gameContainer.innerHTML = '';
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const index = y * size + x;
            const value = tiles[index];
            const div = document.createElement('div');
            div.className = 'tile';

            if (value !== 0) {
                div.innerHTML = createSVG(value);
                div.addEventListener('click', () => moveTile(x, y));
            } else {
                div.style.background = 'transparent';
            }

            gameContainer.appendChild(div);
        }
    }
}

function moveTile(x, y) {
    if (isAdjacent(x, y, emptyPos.x, emptyPos.y)) {
        const fromIdx = y * size + x;
        const toIdx = emptyPos.y * size + emptyPos.x;
        [tiles[fromIdx], tiles[toIdx]] = [tiles[toIdx], tiles[fromIdx]];
        emptyPos.x = x;
        emptyPos.y = y;
        moveCount++;
        updateScore();
        render();
        checkWin();
    }
}

function isAdjacent(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

function updateScore() {
    scoreDisplay.textContent = 'Ходов: ' + moveCount;
}

function checkWin() {
    for (let i = 0; i < 15; i++) {
        if (tiles[i] !== i + 1) return;
    }
    alert('Поздравляем! Вы решили головоломку за ' + moveCount + ' ходов!');
}

document.addEventListener('keydown', (e) => {
    const { x, y } = emptyPos;
    if (e.key === 'ArrowUp' && y < size - 1) {
        moveTile(x, y + 1);
    } else if (e.key === 'ArrowDown' && y > 0) {
        moveTile(x, y - 1);
    } else if (e.key === 'ArrowLeft' && x < size - 1) {
        moveTile(x + 1, y);
    } else if (e.key === 'ArrowRight' && x > 0) {
        moveTile(x - 1, y);
    }
});

init();