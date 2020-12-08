import DS from '@akashaproject/design-system';

const { styled, Box } = DS;

const StyledBox: any = styled(Box)`
  background-color: ${props => props.theme.colors.accentLight};
`;

const PageWrapper: any = styled(Box)`
  background: ${props => props.theme.colors.modalBackgroundAlt};
`;

const ContentWrapper: any = styled(Box)`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: white;
  border-radius: 0.5rem;
  span {
    letter-spacing: 0.03em;
  }
`;

export { StyledBox, PageWrapper, ContentWrapper };
