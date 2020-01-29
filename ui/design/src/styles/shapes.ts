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
  defaultFontSize: '1em',
  fontSizes: {
    small: {
      size: '0.5em',
      height: '1.4',
    },
    medium: {
      size: '0.813em', // ~13px @16px base
      height: '1.5',
    },
    large: {
      size: '0.938em', // ~15px @16px base
      height: '1.3',
    },
    xlarge: {
      size: '1.125em', // ~18px @16px base
      height: '1.5',
    },
  },
  fontWeight: {
    regular: 400,
    bold: 500,
  },
};

export default shapes;
