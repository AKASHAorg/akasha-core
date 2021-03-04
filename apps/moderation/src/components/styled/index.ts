import DS from '@akashaproject/design-system';

const { styled, Box } = DS;

const StyledBox: any = styled(Box)`
  background-color: ${props => props.theme.colors.accentLight};
`;

export { StyledBox };
