import { fabric } from 'fabric';

interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const makeFrame = (canvas: fabric.Canvas, padding: number = 50): string => {
  const objects = canvas.getObjects();
  
  // 경계 상자 계산
  const boundingBox = objects.reduce<BoundingBox>((acc, obj) => {
    const objBoundingBox = obj.getBoundingRect();
    return {
      left: Math.min(acc.left, objBoundingBox.left),
      top: Math.min(acc.top, objBoundingBox.top),
      right: Math.max(acc.right, objBoundingBox.left + objBoundingBox.width),
      bottom: Math.max(acc.bottom, objBoundingBox.top + objBoundingBox.height),
    };
  }, {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  });

  // 경계 상자를 표시하는 사각형 추가
  const rect = new fabric.Rect({
    left: boundingBox.left - padding,
    top: boundingBox.top - padding,
    width: (boundingBox.right - boundingBox.left) + (padding * 2),
    height: (boundingBox.bottom - boundingBox.top) + (padding * 2),
    strokeWidth: 2,
    fill: 'transparent',
  });

  canvas.add(rect);
  canvas.renderAll();

  // 경계 상자 크기로 이미지 저장
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1.0,
    left: boundingBox.left - padding,
    top: boundingBox.top - padding,
    width: (boundingBox.right - boundingBox.left) + (padding * 2),
    height: (boundingBox.bottom - boundingBox.top) + (padding * 2),
  });

  // 사각형 제거
  canvas.remove(rect);
  canvas.renderAll();

  return dataURL;
}; 