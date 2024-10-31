import Annotation from "@/components/Annotation";
import { Button } from "antd";
import { useRef, useState } from "react";

const imgs = [
  "https://img1.baidu.com/it/u=903586749,620841212&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
  "https://img2.baidu.com/it/u=1123697598,2445161376&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=889",
  "https://ww2.sinaimg.cn/mw690/007UEhNzly1hqgs4a5aivj30j60pmad7.jpg",
  "https://t12.baidu.com/it/u=568535726,220547717&fm=30&app=106&f=JPEG?w=640&h=320&s=55B22572CDD16CC20E6DE5DA0100C0B3",
  "https://file4.renrendoc.com/view/fc1bcb608c2dd1bde0511e4e1b0bfb85/fc1bcb608c2dd1bde0511e4e1b0bfb851.gif",
];

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const [val, setVal] = useState<{
    leftTopPosition: { x: number; y: number };
    rightBottomPosition: { x: number; y: number };
    imgIndex: number;
  }>();
  return (
    <div>
      <Button
        type="link"
        onClick={() => {
          setOpen(true);
        }}
      >
        标注
      </Button>
      <Annotation
        open={open}
        onClose={onClose}
        imgs={imgs}
        onSuccess={(values) => {
          setVal(values);
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext("2d");
            canvas.width =
              values.rightBottomPosition.x - values.leftTopPosition.x;
            canvas.height =
              values.rightBottomPosition.y - values.leftTopPosition.y;
            if (context) {
              const img = new Image();
              img.src = imgs[values.imgIndex];
              img.onload = () => {
                context.drawImage(
                  img,
                  values.leftTopPosition.x,
                  values.leftTopPosition.y,
                  values.rightBottomPosition.x - values.leftTopPosition.x,
                  values.rightBottomPosition.y - values.leftTopPosition.y,
                  0,
                  0,
                  values.rightBottomPosition.x - values.leftTopPosition.x,
                  values.rightBottomPosition.y - values.leftTopPosition.y
                );
              };
            }
          }
        }}
      />
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default HomePage;
