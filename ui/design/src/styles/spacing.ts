// spacings and sizing here!!

export interface ISpacing {
  fontSize: string;
  lineHeight: string;
  components: {
    avatar: {
      sizes: {
        [key: string]: string;
      };
    };
    iconButton: {
      padding: string;
      lineHeight: string;
      fontSize: {
        xsmall: string;
        small: string;
        medium: string;
        large: string;
        xlarge: string;
        xxlarge: string;
      };
    };
    button: {
      padding: {
        normal: string;
        small: string;
      };
      borderWidth: string;
      fontSize: {
        normal: string;
        small: string;
      };
    };
    checkbox: {
      borderWidth: string;
      gap: string;
      size: string;
      checkedIconSize: string;
    };
    input: {
      padding: string;
      fontSize: string;
      iconPadding: string;
      borderSize: string;
    };
    radiobutton: {
      borderWidth: string;
      gap: string;
      size: string;
    };
    list: {
      rowPadding: string;
      iconGap: string;
    };
    popover: {
      borderWidth: string;
      width: string;
      searchPopover: {
        padding: string;
        maxHeight: string;
        iconSize: string;
        iconGap: string;
      };
      actionPopover: {
        padding: string;
        buttonGap: string;
      };
    };
    modal: {
      padding: string;
      headerGap: string;
      buttonGap: string;
      maxWidth: string;
    };
  };
  padding: {
    base: string;
    tabs: {
      titleItem: string;
    };
    modal: {
      header: string;
      body: string;
      footer: string;
    };
  };
  margin: {
    base: string;
    list: {
      form: string;
    };
    modal: {
      footer: string;
    };
  };
  defaultMargin: string;
  borderWidth: {
    base: string;
    textInput: {
      middleRow: string;
      suggestions: string;
    };
    modal: string;
  };
  sizes: {
    text: {
      base: string;
    };
    list: {
      text: string;
      searchHeight: string;
      iconWidth: string;
      iconHeight: string;
      buttonHeight: string;
    };
    modal: {
      headerText: string;
      headerLineHeight: string;
      bodyText: string;
      bodyLineHeight: string;
      closeButtonTop: string;
      closeButtonRight: string;
      closeButtonLineHeight: string;
    };
  };
}

// margins, padding, etc..

const basePadding = 4;

const spacing: ISpacing = {
  fontSize: '14px',
  lineHeight: '21px',
  components: {
    avatar: {
      sizes: {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
    },
    iconButton: {
      padding: '0 0.8em',
      lineHeight: '1.2em',
      fontSize: {
        xsmall: '2.084em', // 20px @12px base
        small: '1.786em', // 20px @14px base (default)
        medium: '1.924em', // 20px @13px base
        large: '1.137em', // 20px @22px base
        xlarge: '0.962em', // 20px @26px base
        xxlarge: '0.736em', // 20px @34px base
      },
    },
    button: {
      padding: {
        normal: '7px 10px',
        small: '2px 8px',
      },
      borderWidth: '2px',
      fontSize: {
        normal: '16px',
        small: '14px',
      },
    },
    checkbox: {
      borderWidth: '1px',
      gap: '8px',
      size: '18px',
      checkedIconSize: '18px',
    },
    input: {
      padding: '8px',
      fontSize: '16px',
      iconPadding: '8px',
      borderSize: '1px',
    },
    radiobutton: {
      borderWidth: '1px',
      gap: '8px',
      size: '18px',
    },
    list: {
      rowPadding: '8px',
      iconGap: '4px',
    },
    popover: {
      borderWidth: '1px',
      width: '300px',
      searchPopover: {
        padding: '4px',
        maxHeight: '100px',
        iconSize: '18px',
        iconGap: '8px',
      },
      actionPopover: {
        padding: '16px',
        buttonGap: '8px',
      },
    },
    modal: {
      padding: '16px',
      headerGap: '8px',
      buttonGap: '8px',
      maxWidth: '380px',
    },
  },
  padding: {
    base: `${basePadding}px`,
    tabs: {
      titleItem: `${basePadding * 3}px ${basePadding * 6}px`,
    },
    modal: {
      header: '16px 24px',
      body: '24px',
      footer: '10px 16px',
    },
  },
  margin: {
    base: '4px',
    list: {
      form: '0 12px',
    },
    modal: {
      footer: '10px',
    },
  },
  defaultMargin: '8px',
  borderWidth: {
    base: '1px',
    textInput: {
      middleRow: '1px',
      suggestions: '1px',
    },
    modal: '1px',
  },
  sizes: {
    text: {
      base: '12px',
    },
    list: {
      text: '13px',
      searchHeight: '36px',
      iconWidth: '12px',
      iconHeight: '12px',
      buttonHeight: '30px',
    },
    modal: {
      headerText: '20px',
      headerLineHeight: '22px',
      bodyText: '14px',
      bodyLineHeight: '1.5',
      closeButtonTop: '15px',
      closeButtonRight: '15px',
      closeButtonLineHeight: '1',
    },
  },
};

export default spacing;
