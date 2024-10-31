import { useEffect, useRef } from "react";

const Shape = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = document.body.clientWidth;
      const context = canvas?.getContext("2d");
      if (context) {
        const region = new Path2D();
        region.moveTo(0, 0);
        region.lineTo(0, 50);
        region.lineTo(50, 50);
        context.fillStyle = "red";
        context.fill(region);
        const region2 = new Path2D();
        region2.moveTo(100, 0);
        region2.lineTo(100, 50);
        region2.lineTo(250, 50);
        region2.lineTo(200, 0);
        context.fillStyle = "blue";
        context.fill(region2);
        context.beginPath();
        context.moveTo(300, 0);
        context.quadraticCurveTo(350, 80, 400, 0);
        context.quadraticCurveTo(450, 0, 500, 40);
        context.quadraticCurveTo(300, 200, 300, 0);
        context.fillStyle = "pink";
        context.fill();
      }
    }
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default Shape;
