export const isWindow = typeof window !== 'undefined';
export const pxToDPR = (px: number, dpr: number) => Math.ceil(px * dpr) / dpr;
