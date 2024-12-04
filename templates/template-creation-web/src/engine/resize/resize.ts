export function resize(
  w: number,
  h: number,
  minWidth: number,
  minHeight: number,
  letterbox: boolean,
) {
  const aspectRatio = minWidth / minHeight;
  let canvasWidth = w;
  let canvasHeight = h;

  if (letterbox) {
    if (minWidth < minHeight) {
      canvasHeight = window.innerHeight;
      canvasWidth = Math.min(
        window.innerWidth,
        minWidth,
        canvasHeight * aspectRatio,
      );
    } else {
      canvasWidth = window.innerWidth;
      canvasHeight = Math.min(
        window.innerHeight,
        minHeight,
        canvasWidth / aspectRatio,
      );
    }
  }

  const scaleX = canvasWidth < minWidth ? minWidth / canvasWidth : 1;
  const scaleY = canvasHeight < minHeight ? minHeight / canvasHeight : 1;
  const scale = scaleX > scaleY ? scaleX : scaleY;
  const width = Math.floor(canvasWidth * scale);
  const height = Math.floor(canvasHeight * scale);

  return { width, height };
}
