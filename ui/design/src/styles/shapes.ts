export interface IShapes {
  smallBorderRadius: string;
  borderRadius: string;
  largeBorderRadius: string;
  fontFamily: string;
  fontWeight: {
    regular: number;
    bold: number;
  };
  lightShadow: string;
  darkShadow: string;
}

const shapes: IShapes = {
  smallBorderRadius: '4px',
  borderRadius: '8px',
  largeBorderRadius: '11px',
  fontFamily: 'Content-font, Roboto, sans-serif',
  fontWeight: {
    regular: 400,
    bold: 600,
  },
  lightShadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
  darkShadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
};

export default shapes;
