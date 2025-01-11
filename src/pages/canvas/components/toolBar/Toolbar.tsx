import EraserCursor from "@/assets/svgs/eraserMouseCursor.svg";
import { BrushIcon, EraserIcon, SelectIcon, MoveIcon } from '@/components/icons';

import { fabric } from "fabric";
import { useEffect, useCallback } from "react";

import ToolButton from "@/pages/canvas/components/toolBar/ToolButton";

import activeToolAtom from "@/pages/canvas/components/stateActiveTool";
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import { useAtom, useAtomValue } from "jotai";

import style from "./module/toolBar.module.css"

const Toolbar = () => {
  const [activeTool, setActiveTool] = useAtom(activeToolAtom);
  const canvas = useAtomValue(canvasInstanceAtom);

  /**
   * @description 화이트 보드에 그려져 있는 요소들을 클릭을 통해 선택 가능한지 여부를 제어하기 위한 함수입니다.
   */
  const setIsObjectSelectable = useCallback((isSelectable: boolean) => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.forEachObject((object) => (object.selectable = isSelectable));
  }, [canvas]);

  /**
   * @description 캔버스의 옵션을 리셋하는 함수입니다.
   * @description 그래픽 요소 선택 기능: off, 드로잉 모드: off, 드래그 블럭지정모드: off, 커서: 디폴트 포인터
   */
  const resetCanvasOption = useCallback(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    setIsObjectSelectable(false);
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = "default";
  }, [canvas, setIsObjectSelectable]);

  const handleSelect = useCallback(() => {
    if (!(canvas instanceof fabric.Canvas)) return;

    setIsObjectSelectable(true);
    canvas.selection = true;
    canvas.defaultCursor = "default";
  }, [canvas, setIsObjectSelectable]);

  const handlePen = useCallback(() => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
  }, [canvas]);

  const handleEraser = useCallback(() => {
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
  }, [canvas, activeTool, setIsObjectSelectable]);

  const handleHand = useCallback(() => {
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
  }, [canvas]);

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

      case "eraser":
        handleEraser();
        break;

      case "hand":
        handleHand();
        break;
    }
  }, [activeTool, canvas, handleEraser, handleHand, handlePen, handleSelect, resetCanvasOption]);

  return (
        <div className={style.toolSet}>
          <div className={style.toolButton}>
            <ToolButton
                onClick={() => setActiveTool("pen")}
                disabled={activeTool === "pen"}
                title="Pen Tool"
            >
                <BrushIcon />
                <span className={style.toolTitle}>그리기</span>
            </ToolButton>

            <ToolButton
                onClick={() => setActiveTool("eraser")}
                disabled={activeTool === "eraser"}
                title="Eraser Tool"
            >
                <EraserIcon />
                <span className={style.toolTitle}>지우개</span>
            </ToolButton>

            <ToolButton
                onClick={() => setActiveTool("select")}
                disabled={activeTool === "select"}
                title="Select Tool"
            >
                <SelectIcon />
                <span className={style.toolTitle}>선택하기</span>
            </ToolButton>

            <ToolButton
                onClick={() => setActiveTool("hand")}
                disabled={activeTool === "hand"}
                title="Hand Tool"
            >
                <MoveIcon />
                <span className={style.toolTitle}>움직이기</span>
            </ToolButton>
          </div>
        </div>
  );
};

export default Toolbar;
