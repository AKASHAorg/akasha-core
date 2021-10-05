import DS from '@akashaproject/design-system';
import { DefaultTheme } from '@akashaproject/design-system/lib/styles/themes/interfaces';

const { createGlobalStyle, css } = DS;
export const GlobalStyle: any = createGlobalStyle<{
  theme: DefaultTheme;
}>`
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
  body,
  #root {
    display: flex;
    flex: 1;
  }
  html,
  body {
    font-family: Inter !important;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  body {
    overscroll-behavior-x: none;
  }
  ${props => css`
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
        font-size: 16px;
      }
    }
  `}
  @keyframes bgRotate {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
