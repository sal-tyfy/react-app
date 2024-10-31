import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./index.less";
import { Button, message } from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import cx from "classnames";

interface AnnotationProps {
  imgs: string[];
  onSuccess: (val: {
    leftTopPosition: { x: number; y: number };
    rightBottomPosition: { x: number; y: number };
    imgIndex: number;
  }) => void;
  open: boolean;
  onClose: () => void;
}

export default function Annotation(props: AnnotationProps) {
  const { imgs = [], open, onClose, onSuccess } = props;
  const [current, setCurrent] = useState(0);
  const total = imgs.length;
  const url = imgs[current];
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showRect, setShowRect] = useState(false);
  const showRectRef = useRef<boolean>();
  showRectRef.current = showRect;
  const [showTools, setShowTools] = useState(false);
  const pointRef = useRef();
  const positionRef = useRef();
  const imgRef = useRef<HTMLImageElement>(null);
  const imgSizeRef = useRef({
    width: 0,
    height: 0,
  });
  positionRef.current = position;
  const pointTypeRef = useRef<
    | "rightTop"
    | "rightBottom"
    | "leftTop"
    | "leftBottom"
    | "leftCenter"
    | "rightCenter"
    | "topCenter"
    | "bottomCenter"
  >();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const sizeRef = useRef();
  sizeRef.current = size;
  const wrapperRef = useRef();
  const onMouseMove = (e) => {
    setShowRect(true);
    const { clientX, clientY } = e;
    const { top, left } = wrapperRef.current.getBoundingClientRect();
    const width = clientX - left - positionRef.current.x;
    const height = clientY - top - positionRef.current.y;
    setSize({
      width,
      height,
    });
  };
  const onMouseUp = () => {
    if (showRectRef.current) {
      setShowTools(true);
    }
    document.removeEventListener("mousemove", onMouseMove);
  };
  const onMouseDown = (e) => {
    if (showRect) {
      return;
    }
    setShowTools(false);
    setSize({
      width: 0,
      height: 0,
    });
    const { clientX, clientY } = e;
    const { top, left } = wrapperRef.current.getBoundingClientRect();
    setPosition({
      x: clientX - left,
      y: clientY - top,
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onPointMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { top, left, width, height } =
      wrapperRef.current.getBoundingClientRect();
    let relWidth = clientX - pointRef.current.x;
    let relHeight = clientY - pointRef.current.y;
    const pointType = pointTypeRef.current;
    if (pointType === "leftTop") {
      if (relWidth < 0) {
        if (relWidth <= -position.x) {
          relWidth = -position.x;
        }
      } else {
        if (relWidth >= size.width) {
          relWidth = 0;
          relHeight = 0;
        }
      }
      if (relHeight < 0) {
        if (relHeight <= -position.y) {
          relHeight = -position.y;
        }
      } else {
        if (relHeight >= size.height) {
          relWidth = 0;
          relHeight = 0;
        }
      }
      setPosition({
        x: position.x + relWidth,
        y: position.y + relHeight,
      });
      setSize({
        width: size.width - relWidth,
        height: size.height - relHeight,
      });
    } else if (pointType === "leftBottom") {
      if (relWidth < 0) {
        if (relWidth <= -position.x) {
          relWidth = -position.x;
        }
      } else {
        if (relWidth >= size.width) {
          relWidth = 0;
          relHeight = 0;
        }
      }
      if (relHeight < 0) {
        if (relHeight <= -size.height) {
          relWidth = 0;
          relHeight = 0;
        }
      } else {
        if (relHeight >= height - position.y - size.height) {
          relHeight = height - position.y - size.height;
        }
      }
      setPosition({
        x: position.x + relWidth,
        y: position.y,
      });
      setSize({
        width: size.width - relWidth,
        height: size.height + relHeight,
      });
    } else if (pointType === "rightTop") {
      if (relWidth < 0) {
        if (relWidth <= -size.width) {
          relWidth = 0;
          relHeight = 0;
        }
      } else {
        if (relWidth >= width - position.x - size.width) {
          relWidth = width - position.x - size.width;
        }
      }
      if (relHeight < 0) {
        if (relHeight <= -position.y) {
          relHeight = -position.y;
        }
      } else {
        if (relHeight >= size.height) {
          relWidth = 0;
          relHeight = 0;
        }
      }
      setPosition({
        x: position.x,
        y: position.y + relHeight,
      });
      setSize({
        width: size.width + relWidth,
        height: size.height - relHeight,
      });
    } else if (pointType === "rightBottom") {
      if (relWidth < 0) {
        if (relWidth <= -size.width) {
          relWidth = 0;
          relHeight = 0;
        }
      } else {
        if (relWidth >= width - position.x - size.width) {
          relWidth = width - position.x - size.width;
        }
      }
      if (relHeight < 0) {
        if (relHeight <= -size.height) {
          relWidth = 0;
          relHeight = 0;
        }
      } else {
        if (relHeight >= height - position.y - size.height) {
          relHeight = height - position.y - size.height;
        }
      }
      setSize({
        width: size.width + relWidth,
        height: size.height + relHeight,
      });
    } else if (pointType === "leftCenter") {
      if (relWidth < 0) {
        if (relWidth <= -position.x) {
          relWidth = -position.x;
        }
      } else {
        if (relWidth >= size.width) {
          relWidth = 0;
        }
      }
      setPosition({
        x: position.x + relWidth,
        y: position.y,
      });
      setSize({
        width: size.width - relWidth,
        height: size.height,
      });
    } else if (pointType === "rightCenter") {
      if (relWidth < 0) {
        if (relWidth <= -size.width) {
          relWidth = 0;
        }
      } else {
        if (relWidth >= width - position.x - size.width) {
          relWidth = width - position.x - size.width;
        }
      }
      setSize({
        width: size.width + relWidth,
        height: size.height,
      });
    } else if (pointType === "topCenter") {
      if (relHeight < 0) {
        if (relHeight <= -position.y) {
          relHeight = -position.y;
        }
      } else {
        if (relHeight >= size.height) {
          relHeight = 0;
        }
      }
      setPosition({
        x: position.x,
        y: position.y + relHeight,
      });
      setSize({
        width: size.width,
        height: size.height - relHeight,
      });
    } else if (pointType === "bottomCenter") {
      if (relHeight < 0) {
        if (relHeight <= -size.height) {
          relHeight = 0;
        }
      } else {
        if (relHeight >= height - position.y - size.height) {
          relHeight = height - position.y - size.height;
        }
      }
      setSize({
        width: size.width,
        height: size.height + relHeight,
      });
    }
  };

  const onPointMouseUp = () => {
    document.removeEventListener("mousemove", onPointMouseMove);
  };

  const onPointMouseDown = (e, type) => {
    pointTypeRef.current = type;
    e.stopPropagation();
    const { clientX, clientY } = e;
    pointRef.current = {
      x: clientX,
      y: clientY,
    };
    document.addEventListener("mousemove", onPointMouseMove);
    document.addEventListener("mouseup", onPointMouseUp);
  };

  const closeLayer = () => {
    onClose();
    setShowRect(false);
    setShowTools(false);
  };

  return (
    <div
      className={cx(styles.topLayer, {
        [styles.popup]: open,
        [styles.popdown]: !open,
      })}
    >
      <div className={styles.mask}></div>
      <div>
        <div
          className={styles.close}
          onClick={() => {
            closeLayer();
          }}
        >
          <CloseOutlined style={{ color: "#fff" }} />
        </div>
        <div
          className={cx(styles.left, styles.stepItem)}
          onClick={() => {
            if (current > 0) {
              setShowRect(false);
              setShowTools(false);
              setCurrent((val) => val - 1);
            }
          }}
        >
          <LeftOutlined style={{ color: "#fff" }} />
        </div>
        <div
          className={cx(styles.right, styles.stepItem)}
          onClick={() => {
            if (current < total - 1) {
              setShowRect(false);
              setShowTools(false);
              setCurrent((val) => val + 1);
            }
          }}
        >
          <RightOutlined style={{ color: "#fff" }} />
        </div>
        <div className={styles.bottomZone}>
          <div>
            {current + 1}/{total}
          </div>
        </div>
      </div>
      <div className={styles.actionZone}>
        <div
          ref={wrapperRef}
          className={styles.wrapper}
          style={{ cursor: showTools ? "default" : "crosshair" }}
          onMouseDown={onMouseDown}
        >
          <div className={styles.grayWrapper}>
            <div className={styles.gray}></div>
            <img
              ref={imgRef}
              alt=""
              src={url}
              style={{
                maxWidth: "calc(100vw-140px)",
                maxHeight: "calc(100vh - 140px)",
                display: "block",
              }}
              onLoad={(e) => {
                const img = e.target;
                imgSizeRef.current = {
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                };
              }}
            />
          </div>
          {showRect && (
            <div
              className={styles.rectWrapper}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{
                top: position.y,
                left: position.x,
              }}
            >
              <div className={styles.back}></div>
              <div
                className={styles.rect}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  width: size.width,
                  height: size.height,
                  background: `url(${url}) no-repeat`,
                  backgroundSize: `${wrapperRef.current.getBoundingClientRect().width}px ${wrapperRef.current.getBoundingClientRect().height}px`,
                  backgroundPosition: `-${position.x}px -${position.y}px`,
                }}
              >
                {showTools && (
                  <>
                    <div
                      className={styles.leftTop}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "leftTop");
                      }}
                    ></div>
                    <div
                      className={styles.leftBottom}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "leftBottom");
                      }}
                    ></div>
                    <div
                      className={styles.rightTop}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "rightTop");
                      }}
                    ></div>
                    <div
                      className={styles.rightBottom}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "rightBottom");
                      }}
                    ></div>
                    <div
                      className={styles.leftCenter}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "leftCenter");
                      }}
                    ></div>
                    <div
                      className={styles.rightCenter}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "rightCenter");
                      }}
                    ></div>
                    <div
                      className={styles.topCenter}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "topCenter");
                      }}
                    ></div>
                    <div
                      className={styles.bottomCenter}
                      onMouseDown={(e) => {
                        onPointMouseDown(e, "bottomCenter");
                      }}
                    ></div>
                  </>
                )}
              </div>
              {showTools && (
                <div className={styles.tools}>
                  <Button
                    onClick={() => {
                      setShowRect(false);
                      setShowTools(false);
                    }}
                  >
                    <CloseOutlined />
                  </Button>
                  <Button
                    onClick={() => {
                      if (imgRef.current) {
                        const scale = Number(
                          imgRef.current?.width / imgSizeRef.current.width
                        );
                        const x1 = Math.round(position.x / scale);
                        const y1 = Math.round(position.y / scale);
                        const x2 = Math.round(
                          (position.x + size.width) / scale
                        );
                        const y2 = Math.round(
                          (position.y + size.height) / scale
                        );
                        onSuccess({
                          leftTopPosition: { x: x1, y: y1 },
                          rightBottomPosition: { x: x2, y: y2 },
                          imgIndex: current,
                        });
                        closeLayer();
                      }
                    }}
                  >
                    <CheckOutlined />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
