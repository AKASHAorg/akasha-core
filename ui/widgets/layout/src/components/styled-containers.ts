import DS from '@akashaproject/design-system';
import { css, StyledComponent } from 'styled-components';

const { styled } = DS;

export const BaseContainer: StyledComponent<'div', {}> = styled.div`
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

export const MainAreaContainer: StyledComponent<any, any, any, any> = styled(BaseContainer)`
  flex-grow: 1;
  flex-direction: column-reverse;
  max-width: 100%;
  margin-bottom: 0.5em;
  ${props => css<any>`
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      flex-direction: row;
    }
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      padding: 0 0.25rem;
    }
  `}
`;

export const WidgetContainer: StyledComponent<any, any, any, any> = styled(BaseContainer)`
  position: sticky;
  top: 4em;
`;
