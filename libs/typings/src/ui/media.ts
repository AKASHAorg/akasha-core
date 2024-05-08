export type Image = { height: number; width: number; src: string };

export type ImageObject = {
  originalSrc?: string;
  src: string;
  displaySrc?: string;
  size: { width: number; height: number; naturalWidth?: number; naturalHeight?: number };
  name?: string;
};
