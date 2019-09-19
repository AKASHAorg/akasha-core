import { FormCheckmark } from 'grommet-icons';
import { normalizeColor } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';

export interface CheckboxProps {
  theme: object;
  disabled: boolean;
  checked: boolean;
}

const createCustomCheckBoxTheme = (styledComponentsTheme: DefaultTheme) => ({
  checkBox: {
    border: {
      color: 'light-6',
      width: styledComponentsTheme.spacing.components.checkbox.borderWidth,
      radius: styledComponentsTheme.shapes.borderRadius,
    },
    check: {
      extend: (props: CheckboxProps) => {
        let backgroundColor = 'light-1';
        if (props.checked) {
          backgroundColor = 'neutral-3';
        }
        if (props.disabled) {
          backgroundColor = 'light-2';
        }

        return `background-color: ${normalizeColor(backgroundColor, props.theme)};`;
      },
    },
    color: 'light-1',
    gap: styledComponentsTheme.spacing.components.checkbox.gap,
    hover: {
      border: {
        color: 'neutral-3',
      },
    },
    icon: {
      size: styledComponentsTheme.spacing.components.checkbox.checkedIconSize,
    },
    icons: {
      checked: FormCheckmark,
    },
    size: styledComponentsTheme.spacing.components.checkbox.size,
    extend: (props: CheckboxProps) => {
      const textColor = props.checked && !props.disabled ? 'dark-1' : 'dark-3';

      return `
        opacity: 1;
        color: ${normalizeColor(textColor, props.theme)};
        input[type=checkbox]:disabled + div {
          border-color: ${normalizeColor('light-6', props.theme)};
        }
        input[type=checkbox]:checked:not([disabled]) + div {
          border-color: ${normalizeColor('neutral-3', props.theme)};
        }
        input[type=checkbox]:checked:disabled + div > svg {
          stroke: ${normalizeColor('light-6', props.theme)};
        }
      `;
    },
  },
});

export default createCustomCheckBoxTheme;
