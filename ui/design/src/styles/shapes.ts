export interface IShapes {
  baseSpacing: number;
  smallBorderRadius: string;
  borderRadius: string;
  largeBorderRadius: string;
  fontFamily: string;
  defaultFontSize: string;
  thickness: {
    small: string;
    medium: string;
    large: string;
  };
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
    xxlarge: {
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
  fontFamily: 'Inter, Content-font, Roboto, sans-serif',
  defaultFontSize: '1em',
  thickness: {
    small: '1px',
    medium: '2px',
    large: '3px',
  },
  fontSizes: {
    small: {
      size: '0.688rem',
      height: '1.4',
    },
    medium: {
      size: '0.813rem', // ~13px @16px base
      height: '1.5',
    },
    large: {
      size: '0.938rem', // ~15px @16px base
      height: '1.3',
    },
    xlarge: {
      size: '1.125rem', // ~18px @16px base
      height: '1.5',
    },
    xxlarge: {
      size: '1.5rem', // ~24px @16px base
      height: '1.5',
    },
  },
  fontWeight: {
    regular: 400,
    bold: 600,
  },
};

export default shapes;
