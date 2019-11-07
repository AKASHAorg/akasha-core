export interface IShapes {
  baseSpacing: number;
  smallBorderRadius: string;
  borderRadius: string;
  largeBorderRadius: string;
  fontFamily: string;
  defaultFontSize: string;
  fontSizes: {
    small: {
      size: string;
      height: string;
    };
    medium: {
      size: string;
      height: string;
    };
    large: {
      size: string;
      height: string;
    };
    xlarge: {
      size: string;
      height: string;
    };
  };
  fontWeight: {
    regular: number;
    bold: number;
  };
}

const shapes: IShapes = {
  baseSpacing: 4,
  smallBorderRadius: '4px',
  borderRadius: '8px',
  largeBorderRadius: '11px',
  fontFamily: 'Content-font, Roboto, sans-serif',
  defaultFontSize: '13px',
  fontSizes: {
    small: {
      size: '11px',
      height: '15px',
    },
    medium: {
      size: '13px',
      height: '18px',
    },
    large: {
      size: '15px',
      height: '22px',
    },
    xlarge: {
      size: '17px',
      height: '24px',
    },
  },
  fontWeight: {
    regular: 400,
    bold: 500,
  },
};

export default shapes;
