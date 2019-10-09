export interface IShapes {
  borderRadius: string;
  fontFamily: string;
  fontWeight: {
    regular: number;
    bold: number;
  };
  shadow: string;
}

const shapes: IShapes = {
  borderRadius: '8px',
  fontFamily: 'Content-font, Roboto, sans-serif',
  fontWeight: {
    regular: 400,
    bold: 600,
  },
  shadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
};

export default shapes;
