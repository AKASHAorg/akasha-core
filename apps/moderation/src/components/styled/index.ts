import DS from '@akashaproject/design-system';

const { styled, Box } = DS;

export const StyledBox: any = styled(Box)`
  background-color: ${props => props.theme.colors.accentLight};
`;
