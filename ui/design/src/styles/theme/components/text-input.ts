import { DefaultTheme } from 'styled-components';
import { normalizeColor } from 'grommet/utils';

interface TextInputProps {
  theme: object;
}

const createCustomTextInputTheme = (styledComponentsTheme: DefaultTheme) => ({
  textInput: {
    extend: () => `
      border: ${styledComponentsTheme.spacing.components.input.borderSize} solid ${(
      props: TextInputProps,
    ) => normalizeColor('light-6', props.theme)};
      opacity: 1;
      font-size: ${styledComponentsTheme.spacing.components.input.fontSize};
      width: 100%;
      padding: ${styledComponentsTheme.spacing.components.input.padding};
    `,
    container: {
      extend: () => `
      `,
    },
    placeholder: {
      extend: () => `
        width: 100%;
        color: ${styledComponentsTheme.colors.grey};
      `,
    },
    focus: {
      border: {
        color: 'neutral-3',
      },
    },
  },
});

export default createCustomTextInputTheme;
