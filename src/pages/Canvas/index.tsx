import { useEffect, useRef } from "react";
import styles from "./index.less";
import Shape from "./components/Shape";
import Sign from "@/components/Sign";

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
  }, []);
  return (
    <div>
      <div>canvas</div>
      <div>
        <Shape />
      </div>
      <div>
        <Sign />
      </div>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
};

export default CanvasPage;
