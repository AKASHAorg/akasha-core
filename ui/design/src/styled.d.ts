// import original module declarations
import 'styled-components';
import 'react-toast-notifications';
import IColors from './styles/colors-light/IColors';
import IShapes from './styles/shapes/IShapes';
import { IBreakpoints } from './styles/responsive-breakpoints';
import { ThemeType } from 'grommet';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {
    colors: IColors;
    shapes: IShapes;
    breakpoints: IBreakpoints;
    name?: string;
  }
}

declare module 'react-toast-notifications';
