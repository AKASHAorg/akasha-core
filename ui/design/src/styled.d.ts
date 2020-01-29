// import original module declarations
import 'styled-components';
import IColors from './styles/colors-light/IColors';
import IShapes from './styles/shapes/IShapes';
import { ThemeType } from 'grommet';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {
    colors: IColors;
    shapes: IShapes;
    name?: string;
  }
}
