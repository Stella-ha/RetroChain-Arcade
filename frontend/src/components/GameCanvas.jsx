// GameCanvas.jsx
import React, { useRef, useEffect } from "react";

export default function GameCanvas({ initGame }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let mounted = true;

    (async () => {
      const result = await initGame(ctx, canvas);
      if (!mounted) return;

      // Extract game config and cleanup function
      const game = result.game || result;
      const cleanup = result.cleanup || (() => {});
      const width = result.width || 800;
      const height = result.height || 800;

      // Set canvas dimensions based on game config
      canvas.width = width;
      canvas.height = height;

      function loop() {
        game.draw();
        game.update();
        requestAnimationFrame(loop);
      }
      loop();

      return () => {
        cleanup();
      };
    })();

    return () => {
      mounted = false;
    };
  }, [initGame]);

  return <canvas ref={canvasRef} />;
}
