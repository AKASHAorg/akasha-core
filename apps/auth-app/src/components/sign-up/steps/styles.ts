import DS from '@akashaproject/design-system';

const { Button, styled } = DS;

const StyledButton: any = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};
`;

export { StyledButton };
