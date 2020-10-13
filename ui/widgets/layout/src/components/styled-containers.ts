import DS from '@akashaproject/design-system';

const { css, styled } = DS;

export const BaseContainer: any = styled.div`
  border: 0;
  box-sizing: border-box;
  display: flex;
  flex-basis: auto;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0px;
  min-height: 0px;
  min-width: 0px;
  padding: 0px;
  position: relative;
  z-index: 0;
`;

export const MainAreaContainer: any = styled(BaseContainer)`
  flex-grow: 1;
  flex-direction: column-reverse !important;
  justify-content: center;
  max-width: 100%;
  margin-bottom: 0.5em;
  ${props => css<any>`
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      flex-direction: row !important;
    }
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      padding: 0 0.25rem;
    }
  `}
`;

export const WidgetContainer: any = styled(BaseContainer)`
  position: sticky;
  top: 4em;
`;
