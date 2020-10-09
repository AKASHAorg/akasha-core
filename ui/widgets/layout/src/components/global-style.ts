import DS from '@akashaproject/design-system';
import { GlobalStyleComponent } from 'styled-components';

const { createGlobalStyle, css } = DS;

export const GlobalStyle: GlobalStyleComponent<{}, any> = createGlobalStyle<{ theme: any }>`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }
  html,
  body {
    font-size: 15px;
    height: 100%;
  }
  body {
    margin: 0;
    overscroll-behavior-y: none;
    overflow-y: scroll;
  }
  #root {
    display: flex;
    height: 100%;
  }
  .container {
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
  }
  ${props => css<any>`
    // 1920 and lower
    @media only screen and (min-width: ${props.theme.breakpoints.xlarge.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 1224 and lower
    @media only screen and (min-width: ${props.theme.breakpoints.large.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 1024 and lower
    @media only screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 550 and lower
    @media only screen and (min-width: ${props.theme.breakpoints.small.value}px) {
      :root {
        font-size: 18px;
        line-height: 1.312;
      }
    }
  `}
`;
