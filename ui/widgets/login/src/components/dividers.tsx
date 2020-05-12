import DS from '@akashaproject/design-system';

const { styled } = DS;

export const HorizontalDivider = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;
