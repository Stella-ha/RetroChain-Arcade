// src/games/pacman/pacmanEngine.js

export function initPacman(ctx, canvas) {
  const pacman = {
    x: 100,
    y: 100,
    radius: 20,
    dx: 2,
    dy: 0,
  };

  function drawMap(ctx, canvas, blockSize) {
    map.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        const x = colIndex * blockSize;
        const y = rowIndex * blockSize;

        if (symbol === "-") {
          ctx.fillStyle = "blue";
          ctx.fillRect(x, y, blockSize, blockSize / 4);
        } else if (symbol === "|") {
          ctx.fillStyle = "blue";
          ctx.fillRect(x, y, blockSize / 4, blockSize);
        } else if (symbol === "b") {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(x + blockSize / 2, y + blockSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }


  function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
     drawMap(ctx, canvas, 40); // grid first
  }

  function update() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;
  }

  return { draw, update, pacman };
}
