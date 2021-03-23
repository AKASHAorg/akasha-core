import DS from '@akashaproject/design-system';

const { styled, Box, Button } = DS;

const StyledBox: any = styled(Box)`
  background-color: ${props => props.theme.colors.accentLight};
`;

const ContentCardButton: any = styled(Button)`
  height: auto;
  padding: 0.3rem 0.6rem;
  border-width: 0.1rem;
`;

export { StyledBox, ContentCardButton };
