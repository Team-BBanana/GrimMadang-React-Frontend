import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";
import HandIcon from "@/assets/svgs/whiteboard/hand.svg?react";
import EraserCursor from "@/assets/svgs/eraserMouseCursor.svg";

import { fabric } from "fabric";
import { useEffect } from "react";

import ToolButton from "./ToolButton";

import activeToolAtom from "./stateActiveTool";
import canvasInstanceAtom from "./stateCanvasInstance";
import { useAtom, useAtomValue } from "jotai";

import style from "../CanvasPage.module.css"

const Toolbar = () => {
  const [activeTool, setActiveTool] = useAtom(activeToolAtom);
  const canvas = useAtomValue(canvasInstanceAtom);

  /**
   * @description 화이트 보드에 그려져 있는 요소들을 클릭을 통해 선택 가능한지 여부를 제어하기 위한 함수입니다.
   */
  const setIsObjectSelectable = (isSelectable: boolean) => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.forEachObject((object) => (object.selectable = isSelectable));
  };

  /**
   * @description 캔버스의 옵션을 리셋하는 함수입니다.
   * @description 그래픽 요소 선택 기능: off, 드로잉 모드: off, 드래그 블럭지정모드: off, 커서: 디폴트 포인터
   */
  const resetCanvasOption = () => {
    if (!(canvas instanceof fabric.Canvas)) return;
    setIsObjectSelectable(false);
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = "default";
  };

  const handleSelect = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    setIsObjectSelectable(true);
    canvas.selection = true;
    canvas.defaultCursor = "default";
  };

  const handlePen = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
  };

  const handleEraser = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    setIsObjectSelectable(true);
    canvas.selection = true;

    canvas.defaultCursor = `url("${EraserCursor}"), auto`;

    const handleMouseUp = (target: fabric.Object | undefined) => {
      if (!target) return;
      canvas.remove(target);
    };

    const handleSelectionCreated = (selected: fabric.Object[] | undefined) => {
      if (activeTool === "eraser") {
        selected?.forEach((object) => canvas.remove(object));
      }
      canvas.discardActiveObject().renderAll();
    };

    canvas.on("mouse:up", ({ target }) => handleMouseUp(target));

    canvas.on("selection:created", ({ selected }) => handleSelectionCreated(selected));
  };

  const handleHand = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.defaultCursor = "move";

    let panning = false;
    const handleMouseDown = () => {
      panning = true;
    };
    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      if (panning) {
        const delta = new fabric.Point(event.e.movementX, event.e.movementY);
        canvas.relativePan(delta);
      }
    };
    const handleMouseUp = () => {
      panning = false;
    };
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
  };

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    canvas.off("selection:created");

    resetCanvasOption();

    switch (activeTool) {
      case "select":
        handleSelect();
        break;

      case "pen":
        handlePen();
        break;

      case "stickyNote":

        break;

      // case "image":
      //   break;

      case "eraser":
        handleEraser();
        break;

      case "hand":
        handleHand();
        break;
    }
  }, [activeTool]);

  return (
        <div className="absolute top-2.5 left-2.5  z-10 bg-white p-2 rounded shadow-lg">
          {/*<div className="flex flex-col items-center justify-center p-2 w-12 gap-1 rounded-xl bg-grayscale-lightgray border border-grayscale-lightgray shadow-md ">*/}
          <div style={ { display: "flex", justifyContent: "space-between", alignItems: "center" , gap : "8px"}}>
            <div className={style.toolButton}>
            <ToolButton
                icon={PenIcon}
                onClick={() => {
                  setActiveTool("pen");
                }}
                disabled={activeTool === "pen"}
                title="Pen Tool"
            />

            <ToolButton
                icon={EraserIcon}
                onClick={() => {
                  setActiveTool("eraser");
                }}
                disabled={activeTool === "eraser"}
                title="Eraser Tool"
            />
            <ToolButton
                icon={MouseIcon}
                onClick={() => {
                  setActiveTool("select");
                }}
                disabled={activeTool === "select"}
                title="Select Tool"
            />
            <ToolButton
                icon={HandIcon}
                onClick={() => {
                  setActiveTool("hand");
                }}
                disabled={activeTool === "hand"}
                title="Hand Tool"
            />
            </div>
          </div>
        </div>
  );
};

        export default Toolbar;
