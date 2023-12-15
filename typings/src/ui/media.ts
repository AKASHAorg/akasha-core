export type Image = { height: number; width: number; src: string };

export interface ImageObject {
  originalSrc?: string;
  src: string;
  size: { width: number; height: number; naturalWidth?: number; naturalHeight?: number };
  name?: string;
}
