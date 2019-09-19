import { normalizeColor } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';

export interface RadiobuttonProps {
  theme: object;
  disabled: boolean;
  checked: boolean;
}

const createCustomRadiobuttonTheme = (styledComponentsTheme: DefaultTheme) => ({
  radioButton: {
    border: {
      color: 'light-6',
      width: styledComponentsTheme.spacing.components.radiobutton.borderWidth,
    },
    check: {
      color: 'neutral-3',
    },
    color: 'neutral-3',
    // icon: {
    //   extend: (props: RadiobuttonProps) => {
    //     return `background-color: ${normalizeColor('light-1', props.theme)};`
    //   },
    // },
    gap: styledComponentsTheme.spacing.components.radiobutton.gap,
    hover: {
      border: {
        color: 'neutral-3',
      },
    },
    size: styledComponentsTheme.spacing.components.radiobutton.size,
    extend: (props: RadiobuttonProps) => {
      // const textColor = props.checked && !props.disabled ? 'dark-1' : 'dark-3'

      return `
        opacity: 1;
        color: ${normalizeColor('dark-3', props.theme)};

        input[type=radio]:disabled + div {
          border-color: ${normalizeColor('light-6', props.theme)};
        }
        input[type=radio]:disabled + div > svg > circle {
          fill: ${normalizeColor('light-6', props.theme)};
        }

        &:has(input[type=radio]:checked) > span {
          color: ${normalizeColor('dark-1', props.theme)};
        }
      `;
    },
  },
});

export default createCustomRadiobuttonTheme;
