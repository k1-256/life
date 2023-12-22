document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById("startButton");
    const randomButton = document.getElementById("randomButton");
    const widthInput = document.getElementById("widthInput");
    const heightInput = document.getElementById("heightInput");
    const timeDisplay = document.getElementById("timeDisplay");
    let cells = new Set();
    let timer, width, height, cellSize = 10;

    function createBoard(w, h) {
        width = w;
        height = h;
        canvas.width = w * cellSize;
        canvas.height = h * cellSize;
        cells.clear();
        drawBoard();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        cells.forEach(key => {
            let [x, y] = key.split(',').map(Number);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    }

    function toggleCell(x, y) {
        const key = `${x},${y}`;
        if (cells.has(key)) {
            cells.delete(key);
        } else {
            cells.add(key);
        }
        drawBoard();
    }

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);
        toggleCell(x, y);
    });

    function nextGeneration() {
        const start = performance.now();
        const newCells = new Set();
        const checkCells = new Set();

        cells.forEach(key => {
            let [x, y] = key.split(',').map(Number);
            let aliveNeighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = (x + dx + width) % width;
                    const ny = (y + dy + height) % height;
                    const neighborKey = `${nx},${ny}`;
                    if (cells.has(neighborKey)) {
                        aliveNeighbors++;
                    } else {
                        checkCells.add(neighborKey);
                    }
                }
            }
            if (aliveNeighbors === 2 || aliveNeighbors === 3) {
                newCells.add(key);
            }
        });

        checkCells.forEach(key => {
            let [x, y] = key.split(',').map(Number);
            let aliveNeighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = (x + dx + width) % width;
                    const ny = (y + dy + height) % height;
                    if (cells.has(`${nx},${ny}`)) {
                        aliveNeighbors++;
                    }
                }
            }
            if (aliveNeighbors === 3) {
                newCells.add(key);
            }
        });

        cells = newCells;
        drawBoard();
        const end = performance.now();
        timeDisplay.textContent = (end - start).toFixed(2);
    }

    startButton.addEventListener("click", () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
            startButton.textContent = "Старт";
        } else {
            timer = setInterval(nextGeneration, 100);
            startButton.textContent = "Стоп";
        }
    });

    randomButton.addEventListener("click", () => {
        cells.clear();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (Math.random() < 0.5) {
                    cells.add(`${x},${y}`);
                }
            }
        }
        drawBoard();
    });

    widthInput.addEventListener("change", () => {
        const newWidth = parseInt(widthInput.value);
        if (!isNaN(newWidth) && newWidth > 0) {
            createBoard(newWidth, height);
        }
    });

    heightInput.addEventListener("change", () => {
        const newHeight = parseInt(heightInput.value);
        if (!isNaN(newHeight) && newHeight > 0) {
            createBoard(width, newHeight);
        }
    });

    createBoard(50, 30); // Инициализация с размером по умолчанию
});
