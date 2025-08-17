// src/games/pacman/pacmanEngine.js

export function initPacman(ctx, canvas) {
  const pacman = {
    x: 100,
    y: 100,
    radius: 20,
    dx: 2,
    dy: 0,
  };

  const map = [
    ["1", "-", "-", "-", "-", "-", "2"],
    ["|", " ", "b", "b", "b", " ", "|"],
    ["|", "b", "1", "-", "2", "b", "|"],
    ["|", "b", "|", " ", "|", "b", "|"],
    ["4", "-", "3", "b", "4", "-", "3"],
  ];

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
    //  drawPacman(ctx, pacman);
    // Pac-Man body
    // ctx.fillStyle = "yellow";
    // ctx.beginPath();
    // ctx.arc(pacman.x, pacman.y, pacman.radius, 0.25 * Math.PI, 1.75 * Math.PI);
    // ctx.lineTo(pacman.x, pacman.y);
    // ctx.fill();
  }

  function update() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;
  }

  return { draw, update, pacman };
}
