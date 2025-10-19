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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

class Pellet {
  constructor({ position, radius = 4 }) {
    this.position = position;
    this.radius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

class PowerPellet extends Pellet {
  constructor({ position }) {
    super({ position, radius: 10 });
  }
}

class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position, image }) {
    this.position = position;
    this.width = Boundary.width;
    this.height = Boundary.height;
    this.image = image;
  }

  draw(ctx) {
    if (this.image && this.image.complete) {
      const prev = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
      ctx.imageSmoothingEnabled = prev;
    } else {
      // fallback: blue rectangle
      ctx.fillStyle = "blue";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
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

// Collision helper function
function circleCollidesWithRectangle({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1;
  // const padding = 1; // less padding for better collision
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width
  );
}

export default function PacmanGame() {
  const canvasRef = useRef();

  const pellets = [];
  const powerPellets = [];
  const map = [
    ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
    ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
    ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
  ];

  useEffect(() => {
    let mounted = true;
    try{
      (async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        canvas.width = map[0].length * Boundary.width;
        canvas.height = map.length * Boundary.height;

        const IMAGE_PATHS = {
          "-": "src/assets/pacman/pipeHorizontal.png",
          "|": "src/assets/pacman/pipeVertical.png",
          1: "src/assets/pacman/pipeCorner1.png",
          2: "src/assets/pacman/pipeCorner2.png",
          3: "src/assets/pacman/pipeCorner3.png",
          4: "src/assets/pacman/pipeCorner4.png",
          b: "src/assets/pacman/block.png",
          _: "src/assets/pacman/capBottom.png",
          "+": "src/assets/pacman/pipeCross.png",
          7: "src/assets/pacman/pipeConnectorBottom.png",
          5: "src/assets/pacman/pipeConnectorTop.png",
          6: "src/assets/pacman/pipeConnectorRight.png",
          8: "src/assets/pacman/pipeConnectorLeft.png",
          "[": "src/assets/pacman/capLeft.png",
          "]": "src/assets/pacman/capRight.png",
          "^": "src/assets/pacman/capTop.png",
        };

        const srcs = new Set();
        map.forEach((row) =>
          row.forEach((sym) => {
            if (IMAGE_PATHS[sym]) srcs.add(IMAGE_PATHS[sym]);
          })
        );
        const loadPromises = Array.from(srcs).map((src) =>
          loadImage(src)
            .then((img) => ({ src, img }))
            .catch((err) => ({ src, err }))
        );
        const results = await Promise.all(loadPromises);
        const loadedImages = {};
        results.forEach((r) => {
          if (r.img) loadedImages[r.src] = r.img;
        });

        const boundaries = [];
        map.forEach((row, i) => {
          row.forEach((symbol, j) => {
            const x = j * Boundary.width;
            const y = i * Boundary.height;
            if (
              IMAGE_PATHS[symbol] ||
              [
                "-",
                "|",
                "1",
                "2",
                "3",
                "4",
                "b",
                "[",
                "]",
                "7",
                "5",
                "^",
                "+",
              ].includes(symbol)
            ) {
              const image = IMAGE_PATHS[symbol]
                ? loadedImages[IMAGE_PATHS[symbol]] || null
                : null;
              boundaries.push(new Boundary({ position: { x, y }, image }));
            }
          });
        });

        // console.log("✅ Loaded images:", Object.keys(loadedImages));
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

        // Draw static map once
        const drawStaticMap = () => {
          map.forEach((row, i) => {
            row.forEach((symbol, j) => {
              const x = j * Boundary.width;
              const y = i * Boundary.height;
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
                  break;
                case "p":
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
                  break;
              }
            });
          });
        };
        drawStaticMap();

        let lastDirection = { x: pacman.speed, y: 0 };

        function animate() {
          requestAnimationFrame(animate);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawStaticMap();
          boundaries.forEach((boundary) => boundary.draw(ctx));
          let newVelocity = { ...lastDirection };

          if (keys.ArrowUp || keys.w) newVelocity = { x: 0, y: -pacman.speed };
          else if (keys.ArrowDown || keys.s)
            newVelocity = { x: 0, y: pacman.speed };
          else if (keys.ArrowLeft || keys.a)
            newVelocity = { x: -pacman.speed, y: 0 };
          else if (keys.ArrowRight || keys.d)
            newVelocity = { x: pacman.speed, y: 0 };

          // Predict next move
          const nextCircle = { ...pacman, velocity: newVelocity };
          let collidingNext = boundaries.some((b) =>
            circleCollidesWithRectangle({ circle: nextCircle, rectangle: b })
          );

          // Predict current path (for lastDirection)
          const continueCircle = { ...pacman, velocity: lastDirection };
          let collidingContinue = boundaries.some((b) =>
            circleCollidesWithRectangle({
              circle: continueCircle,
              rectangle: b,
            })
          );

          // Move only if not colliding
          if (!collidingNext) {
            pacman.velocity = newVelocity;
            lastDirection = newVelocity;
          } else {
            // if the new direction collides, just keep moving in the last valid direction
            const continueCircle = { ...pacman, velocity: lastDirection };
            const collidingContinue = boundaries.some((b) =>
              circleCollidesWithRectangle({
                circle: continueCircle,
                rectangle: b,
              })
            );
            if (!collidingContinue) {
              pacman.velocity = lastDirection;
            } else {
              pacman.velocity = { x: 0, y: 0 };
            }
          }

          // drawMap();
          pacman.update(ctx);
          // requestAnimationFrame(animate);
        }
        animate();
        // drawMap();

        return () => {
          removeEventListener("keydown", handleKeyDown);
          removeEventListener("keyup", handleKeyUp);
        };
      })();
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
