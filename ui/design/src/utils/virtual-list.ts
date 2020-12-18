interface RectLike {
  top: number;
  height: number;
}

const inRange = (val: number, from: number, to: number) => {
  return from <= val && to > val;
};

const getBottom = (rect: RectLike) => {
  return rect.top + rect.height;
};

/* check if rectA is intersecting with rectB */
export const isIntersecting = (rectA: RectLike, rectB: RectLike) => {
  return (
    inRange(rectA.top, rectB.top, getBottom(rectB)) ||
    inRange(rectB.top, rectA.top, getBottom(rectA))
  );
};
