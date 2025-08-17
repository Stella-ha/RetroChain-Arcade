// GameCanvas.jsx
import React, { useRef, useEffect } from "react";

export default function GameCanvas({ initGame }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 800;

    const game = initGame(ctx, canvas);

    function loop() {
      game.draw();
      game.update();
      requestAnimationFrame(loop);
    }
    loop();
  }, [initGame]);

  return <canvas ref={canvasRef} />;
}
