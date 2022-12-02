import DS, { BoxExtendedProps } from '@akashaorg/design-system';

const { Box, styled } = DS;

const StyledBox: React.FC<BoxExtendedProps> = styled(Box)`
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    width: 100%;
    > div: {
      padding-left: 0;
      padding-right: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

export { StyledBox };
