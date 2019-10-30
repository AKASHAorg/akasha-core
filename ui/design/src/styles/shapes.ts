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
  lightShadow: string;
  darkShadow: string;
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
    bold: 600,
  },
  lightShadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
  darkShadow: '0 8px 24px 0 rgba(83,98,124,0.06)',
};

export default shapes;
