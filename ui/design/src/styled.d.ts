// import original module declarations
import 'styled-components';
import IColors from './styles/colors-light/IColors';
import IShapes from './styles/shapes/IShapes';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: IColors;
    shapes: IShapes;
    name?: string;
  }
}
