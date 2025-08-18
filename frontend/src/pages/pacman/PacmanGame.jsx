// PacmanGame.jsx
import React, { useEffect, useRef } from "react";

class PacMan {
   constructor({ position, velocity }) {
     this.position = position;
     this.velocity = velocity;
     this.radius = 15;
    //  this.speed = 2; // speed of Pac
   }

   draw(ctx) {
     ctx.beginPath();
     ctx.arc(
       this.position.x,
       this.position.y,
       this.radius,
       0.25 * Math.PI,
       1.75 * Math.PI
     ); // chomping mouth
     ctx.lineTo(this.position.x, this.position.y);
     ctx.fillStyle = "yellow";
     ctx.fill();
     ctx.closePath();
   }

   update(ctx) {
     this.draw(ctx);
     this.position.x += this.velocity.x;
     this.position.y += this.velocity.y;
   }
}

class Boundary {
  static width = 40
  static height = 40;
   constructor({ position }) {
     this.position = position;
     this.width = Boundary.width;
     this.height = Boundary.height;
   }

   draw(ctx) {
     ctx.fillStyle = "blue";
     ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
   }
}

const colors = {
  wall: "blue",
  pellet: "white",
  powerPellet: "white",
  blank: "black",
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

export default function PacmanGame() {
  const canvasRef = useRef();

  const map = [
    ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
    ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "-", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "-", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
    ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
  ];

  useEffect(() => {
    try{
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      
      canvas.width = map[0].length * Boundary.width;
      canvas.height = map.length * Boundary.height;
      
      const pacmanStart = {
        x: 5 * Boundary.width + Boundary.width / 2,
        y: 8 * Boundary.height + Boundary.height / 2,
      };

      const pacman = new PacMan({
        position: pacmanStart,
        velocity: { x: 0, y: 0 },
      });
      pacman.speed = 2;

      const handleKeyDown = (e) => {
        if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
      };
      const handleKeyUp = (e) => {
        if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
      };
      addEventListener("keydown", handleKeyDown);
      addEventListener("keyup", handleKeyUp);

      const drawMap = () => {
        map.forEach((row, i) => {
          row.forEach((symbol, j) => {
            const x = j * Boundary.width;
            const y = i * Boundary.height;
            const isPacmanTile =
              Math.floor(pacmanStart.x / Boundary.width) === j &&
              Math.floor(pacmanStart.y / Boundary.height) === i;
            switch (symbol) {
              case "-":
              case "|":
              case "1":
              case "2":
              case "3":
              case "4":
              case "b":
              case "[":
              case "]":
              case "7":
              case "5":
              case "^":
              case "+":
                ctx.fillStyle = colors.wall;
                ctx.fillRect(x, y, Boundary.width, Boundary.height);
                break;

              case ".":
                if (!isPacmanTile) {
                  ctx.beginPath();
                  ctx.arc(
                    x + Boundary.width / 2,
                    y + Boundary.height / 2,
                    4,
                    0,
                    Math.PI * 2
                  );
                  ctx.fillStyle = colors.pellet;
                  ctx.fill();
                }
                break;
              case "p":
                if (!isPacmanTile) {
                  ctx.beginPath();
                  ctx.arc(
                    x + Boundary.width / 2,
                    y + Boundary.height / 2,
                    10,
                    0,
                    Math.PI * 2
                  );
                  ctx.fillStyle = colors.powerPellet;
                  ctx.fill();
                }
                break;
              default:
                // Empty space
                ctx.fillStyle = colors.blank;
                ctx.fillRect(x, y, Boundary.width, Boundary.height);
                break;
            }
          });
        });
        pacman.update(ctx);
      };
      
      function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        if (keys.ArrowUp || keys.w) {
          pacman.velocity.y = -pacman.speed;
          pacman.velocity.x = 0;
        } else if (keys.ArrowDown || keys.s) {
          pacman.velocity.y = pacman.speed;
          pacman.velocity.x = 0;
        } else if (keys.ArrowLeft || keys.a) {
          pacman.velocity.x = -pacman.speed;
          pacman.velocity.y = 0;
        } else if (keys.ArrowRight || keys.d) {
          pacman.velocity.x = pacman.speed;
          pacman.velocity.y = 0;
        } else {
          pacman.velocity.x = 0;
          pacman.velocity.y = 0;
        }
        pacman.update(ctx);
        requestAnimationFrame(animate);
      }
      animate();
      drawMap();

      return () => {
        removeEventListener("keydown", handleKeyDown);
        removeEventListener("keyup", handleKeyUp);
      };
    } catch (error) {
      console.error("Error in draw function:", error);
    }
  }, []);
  

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-yellow-400 text-3xl font-bold mb-2">Pac-Man</h1>
      <canvas ref={canvasRef} width={800} height={800} className="bg-black" />
    </div>
  );
}
