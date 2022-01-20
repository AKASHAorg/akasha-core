import DS, { BoxExtendedProps, ButtonExtendedProps } from '@akashaproject/design-system';

const { Button, Box, styled } = DS;

const StyledBox: React.FC<BoxExtendedProps> = styled(Box)`
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    position: fixed;
    width: 100%;
    padding: 1rem;
    left: 0;
    bottom: 0;
    font-size: 0.9375rem;
    background: ${props => props.theme.colors.white};
  }
`;

const StyledButton: React.FC<ButtonExtendedProps> = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};

  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    height: auto;
    padding: 1rem 0;
    width: 100%;
    svg {
      position: absolute;
      right: 2rem;
    }
  }
`;

const CheckBoxWrap: React.FC<BoxExtendedProps> = styled(Box)`
  margin: 1.15rem 0;

  > * {
    margin: 0.3rem 0;
  }
`;

export { StyledButton, StyledBox, CheckBoxWrap };
