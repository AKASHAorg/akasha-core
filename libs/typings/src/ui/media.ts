/**
 * Type defining image object
 **/
export type Image = { height?: number; width?: number; src: string };

/**
 * Type defining gallery image object
 **/
export type GalleryImage = {
  originalSrc?: string;
  src: string;
  displaySrc?: string;
  size: { width: number; height: number; naturalWidth?: number; naturalHeight?: number };
  name?: string;
};
