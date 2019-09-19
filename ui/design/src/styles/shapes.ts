export interface IShapes {
  borderRadius: string;
  fontFamily: string;
  fontWeight: {
    regular: number;
    bold: number;
  };
  shadow0: string;
  shadow1: string;
  shadow2: string;
  shadow3: string;
}

const shapes: IShapes = {
  borderRadius: '3px',
  fontFamily: 'Content-font, Roboto, sans-serif',
  fontWeight: {
    regular: 500,
    bold: 600,
  },
  shadow0: '0px 1px 4px 0px',
  shadow1: '0px 1px 4px 0px',
  shadow2: '0px 1px 4px 0px',
  shadow3: '0px 1px 4px 0px',
};

export default shapes;
