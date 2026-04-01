// pacmanEngine.js - Game logic for Pac-Man

class PacMan {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.mouthFrame = 0; // Frame counter for smooth animation
    this.lastAngle = 0;
  }

  draw(ctx) {
    // Get direction Pac-Man is moving
    if (this.velocity.x !== 0 || this.velocity.y !== 0){
      this.lastAngle = Math.atan2(this.velocity.y, this.velocity.x);
    }
    const angle = this.velocity.x !== 0 || this.velocity.y !== 0
      ? Math.atan2(this.velocity.y, this.velocity.x)
      : this.lastAngle;

    // Calculate mouth opening: oscillates between 0.05π and 0.35π
    const maxMouth = 0.35 * Math.PI;
    const minMouth = 0.05 * Math.PI;
    const oscillation = Math.sin(this.mouthFrame / 10) * 0.8 + 0.5; // 0 to 1
    const mouthAngle = minMouth + (maxMouth - minMouth) * oscillation;

    // Draw Pac-Man body
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, mouthAngle, 2 * Math.PI - mouthAngle);
    ctx.lineTo(0, 0);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();

    ctx.restore(); // Restore context state
  }

  update(ctx) {
    this.draw(ctx);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Increment mouth animation frame
    this.mouthFrame++;
  }
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
      ctx.fillStyle = "blue";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
}

class Ghost{
  constructor({ position, velocity, color, speed }){
    this.position = position;
    this.velocity = velocity;
    this.speed = speed;
    this.color = color;
    this.radius = 15;
    this.moveCounter = 0;        // Counter for changing direction
    // Use the velocity direction to set initial currentDirection
    this.currentDirection = { x: velocity.x, y: velocity.y };
  }
 
  draw(ctx){
    ctx.save();
    ctx.beginPath();
    // Ghost top (semicircle - rounded head)
    ctx.arc(this.position.x, this.position.y, this.radius, Math.PI, 0, false);
    // Right side of body (straight down)
    ctx.lineTo(this.position.x + this.radius, this.position.y + this.radius);
    // Bumpy bottom - 3 rounded bumps
    const bumpWidth = (this.radius * 2) / 3; // 3 bumps across width
    const bumpHeight = this.radius * 0.4;
    
    // Bump 1 (right)
    ctx.quadraticCurveTo(
      this.position.x + this.radius - bumpWidth / 2,
      this.position.y + this.radius + bumpHeight,
      this.position.x + this.radius - bumpWidth,
      this.position.y + this.radius
    );
    
    // Bump 2 (middle)
    ctx.quadraticCurveTo(
      this.position.x - bumpWidth / 2,
      this.position.y + this.radius + bumpHeight,
      this.position.x - bumpWidth,
      this.position.y + this.radius
    );
    
    // Bump 3 (left)
    ctx.quadraticCurveTo(
      this.position.x - this.radius + bumpWidth / 2,
      this.position.y + this.radius + bumpHeight,
      this.position.x - this.radius,
      this.position.y + this.radius
    );
    
    // Left side of body (straight up to close shape)
    ctx.lineTo(this.position.x - this.radius, this.position.y);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    
    // Draw eyes
    this.drawEyes(ctx);
    ctx.restore();
  }
  
  drawEyes(ctx) {
    const eyeRadius = 3;
    const leftEyeX = this.position.x - 5;
    const rightEyeX = this.position.x + 5;
    const eyeY = this.position.y - 2;
    
    // Left eye (white)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye (white)
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Left pupil (black)
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Right pupil (black)
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  updateDirection(boundaries, canvasWidth, canvasHeight, depth = 0) {
    // Prevent infinite recursion (max 4 attempts)
    if (depth > 4) return;
    
    // Change direction every 60 frames (~1 second at 60fps)
    this.moveCounter++;
    if (this.moveCounter > 60) {
      this.moveCounter = 0;
      
      // Pick a random direction for THIS ghost
      const directions = [
        { x: this.speed, y: 0 },   // Right
        { x: -this.speed, y: 0 },  // Left
        { x: 0, y: this.speed },   // Down
        { x: 0, y: -this.speed }   // Up
      ];
      this.currentDirection = directions[Math.floor(Math.random() * directions.length)];
    }

    // Check wall collision using current position and direction
    let hitWall = false;
    boundaries.forEach(boundary => {
      const testCircle = { 
        position: this.position,  // Current position
        velocity: this.currentDirection,  // Direction to test
        radius: this.radius 
      };
      if (circleCollidesWithRectangle({ circle: testCircle, rectangle: boundary })) {
        hitWall = true;
      }
    });
    
    // If hit wall, pick a new direction immediately
    if (hitWall) {
      this.moveCounter = 0; // Reset counter to force direction change
      this.updateDirection(boundaries, canvasWidth, canvasHeight, depth + 1); // Recursively try again with depth limit
    }
  }

  update(ctx, boundaries, canvasWidth, canvasHeight){
    this.updateDirection(boundaries, canvasWidth, canvasHeight);
    this.draw(ctx);
    this.position.x += this.currentDirection.x;
    this.position.y += this.currentDirection.y;
    
    // Clamp ghost position to stay within canvas boundaries
    this.position.x = Math.max(this.radius, Math.min(this.position.x, canvasWidth - this.radius));
    this.position.y = Math.max(this.radius, Math.min(this.position.y, canvasHeight - this.radius));
  }
}

const colors = {
  wall: "blue",
  pellet: "white",
  powerPellet: "white",
  blank: "black",
};

// Global key state
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

function circleCollidesWithRectangle({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1;
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

export async function initPacmanGame(ctx, canvas, setScore) {
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

  // Load images
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

  // Create boundaries and pellets from map
  const boundaries = [];
  const pellets = [];
  const powerPellets = [];

  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      const x = j * Boundary.width;
      const y = i * Boundary.height;

      if (
        IMAGE_PATHS[symbol] ||
        ["-", "|", "1", "2", "3", "4", "b", "[", "]", "7", "5", "^", "+"].includes(
          symbol
        )
      ) {
        const image = IMAGE_PATHS[symbol]
          ? loadedImages[IMAGE_PATHS[symbol]] || null
          : null;
        boundaries.push(new Boundary({ position: { x, y }, image }));
      } else if (symbol === ".") {
        pellets.push(
          new Pellet({
            position: {
              x: x + Boundary.width / 2,
              y: y + Boundary.height / 2,
            },
          })
        );
      } else if (symbol === "p") {
        powerPellets.push(
          new PowerPellet({
            position: {
              x: x + Boundary.width / 2,
              y: y + Boundary.height / 2,
            },
          })
        );
      }
    });
  });

  // Initialize Pac-Man
  const pacmanStart = {
    x: 5 * Boundary.width + Boundary.width / 2,
    y: 8 * Boundary.height + Boundary.height / 2,
  };

  const pacman = new PacMan({
    position: pacmanStart,
    velocity: { x: 0, y: 0 },
  });
  pacman.speed = 2;

  const canvasWidth = map[0].length * Boundary.width;
  const canvasHeight = map.length * Boundary.height;
  
  const ghosts = [
    new Ghost({
      position: { // Top-left corner
        x: 1 * Boundary.width + Boundary.width / 2,
        y: 1 * Boundary.height + Boundary.height / 2
      },
      velocity: { x: 1.5, y: 0 }, // Start moving right
      speed: 1.5,
      color: "red",
    }),
    new Ghost({
      position: { // Bottom-left corner
        x: 1 * Boundary.width + Boundary.width / 2,
        y: 11 * Boundary.height + Boundary.height / 2
      },
      velocity: { x: 1.5, y: 0 }, // Start moving right
      speed: 1.5,
      color: "#FFB8FF", 
    }),
    new Ghost({
      position: { // Top-right corner
        x: 9 * Boundary.width + Boundary.width / 2,
        y: 1 * Boundary.height + Boundary.height / 2
      },
      velocity: { x: -1.5, y: 0 }, // Start moving left
      speed: 1.5,
      color: "#00FFFF", 
    }),
    new Ghost({
      position: { // Bottom-right corner
        x: 9 * Boundary.width + Boundary.width / 2,
        y: 11 * Boundary.height + Boundary.height / 2
      },
      velocity: { x: -1.5, y: 0 }, // Start moving left
      speed: 1.5,
      color: "#FF8800", 
    }),
  ]

  // Setup keyboard listeners
  const handleKeyDown = (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
  };
  const handleKeyUp = (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  };
  addEventListener("keydown", handleKeyDown);
  addEventListener("keyup", handleKeyUp);

  // Draw static map background
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
          case "p":
            break;
        }
      });
    });
  };

  let lastDirection = { x: pacman.speed, y: 0 };
  let gameTimer = 0;  // Timer for 3-second startup delay (180 frames at 60fps)
  const STARTUP_DELAY = 180; // 3 seconds

  // Collision helper for separate axes
  function canMoveWithVelocity(circle, velocity) {
    const testCircle = { ...circle, velocity };
    return !boundaries.some((b) =>
      circleCollidesWithRectangle({ circle: testCircle, rectangle: b })
    );
  }

  // Game object returned with draw() and update() methods
  const game = {
    draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStaticMap();
      boundaries.forEach((boundary) => boundary.draw(ctx));

      // Draw pellets
      for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i];
        pellet.draw(ctx);

        const dx = pacman.position.x - pellet.position.x;
        const dy = pacman.position.y - pellet.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.radius + pellet.radius) {
          pellets.splice(i, 1);
          setScore((prev) => prev + 1);
        }
      }

      // Draw power pellets
      for (let i = powerPellets.length - 1; i >= 0; i--) {
        const powerPellet = powerPellets[i];
        powerPellet.draw(ctx);

        const dx = pacman.position.x - powerPellet.position.x;
        const dy = pacman.position.y - powerPellet.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.radius + powerPellet.radius) {
          powerPellets.splice(i, 1);
          setScore((prev) => prev + 10);
        }
      }

      // Only move after 3-second startup delay (180 frames at 60fps)
      if (gameTimer < STARTUP_DELAY) {
        // Draw with no movement, only mouth effect
        pacman.draw(ctx);
        pacman.mouthFrame++; // Increment mouth animation during startup
        ghosts.forEach((ghost) => ghost.draw(ctx));
      } else {
        // Move characters after startup
        pacman.update(ctx);
        ghosts.forEach(
          (ghost) => ghost.update(ctx, boundaries, canvasWidth, canvasHeight)
        );
      }
    },

    update() {
      // Increment game timer every frame
      gameTimer++;
      // Only process input after startup delay
      if (gameTimer < STARTUP_DELAY) {
        return;
      }
      
      let newVelocity = { ...lastDirection };

      if (keys.ArrowUp || keys.w) newVelocity = { x: 0, y: -pacman.speed };
      else if (keys.ArrowDown || keys.s)
        newVelocity = { x: 0, y: pacman.speed };
      else if (keys.ArrowLeft || keys.a)
        newVelocity = { x: -pacman.speed, y: 0 };
      else if (keys.ArrowRight || keys.d)
        newVelocity = { x: pacman.speed, y: 0 };

      // Try new velocity first
      if (canMoveWithVelocity(pacman, newVelocity)) {
        pacman.velocity = newVelocity;
        lastDirection = newVelocity;
      } else {
        // Try to split X and Y for wall sliding
        const splitVelocityX = { x: newVelocity.x, y: 0 };
        const splitVelocityY = { x: 0, y: newVelocity.y };

        let canMoveX = canMoveWithVelocity(pacman, splitVelocityX);
        let canMoveY = canMoveWithVelocity(pacman, splitVelocityY);

        if (canMoveX && canMoveY) {
          pacman.velocity = newVelocity;
          lastDirection = newVelocity;
        } else if (canMoveX) {
          pacman.velocity = splitVelocityX;
          lastDirection = splitVelocityX;
        } else if (canMoveY) {
          pacman.velocity = splitVelocityY;
          lastDirection = splitVelocityY;
        } else {
          if (canMoveWithVelocity(pacman, lastDirection)) {
            pacman.velocity = lastDirection;
          } else {
            pacman.velocity = { x: 0, y: 0 };
          }
        }
      }
    },
  };

  // Cleanup function
  const cleanup = () => {
    removeEventListener("keydown", handleKeyDown);
    removeEventListener("keyup", handleKeyUp);
  };

  return { game, cleanup, width: canvasWidth, height: canvasHeight };
}

