import { useEffect, useRef } from "react";
import styles from "./index.less";
import { Button } from "antd";

const Sign = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 4;
        context.strokeStyle = "red";
        const draw = (e: MouseEvent) => {
          context.lineTo(e.offsetX, e.offsetY);
          context.stroke();
        };
        canvas.addEventListener("mousedown", (e) => {
          context.beginPath();
          context.moveTo(e.offsetX, e.offsetY);
          canvas.addEventListener("mousemove", draw);
          canvas.addEventListener("mouseup", () => {
            canvas.removeEventListener("mousemove", draw);
          });
        });
      }
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.signTitle}>签名区域</div>
      <canvas
        className={styles.canvas}
        height={600}
        width={1000}
        ref={canvasRef}
      ></canvas>
      <div className={styles.footer}>
        <Button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) {
              const context = canvas.getContext("2d");
              if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
          }}
        >
          清除
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) {
              canvas.toBlob((blob) => {
                if (blob) {
                  const a = document.createElement("a");
                  a.download = "签名.png";
                  a.href = URL.createObjectURL(blob);
                  a.click();
                  a.remove();
                }
              });
            }
          }}
        >
          确认
        </Button>
      </div>
    </div>
  );
};

export default Sign;
