// import original module declarations
import 'styled-components';
import IColors from './styles/IColors';
import IShapes from './styles/IShapes';
import ISpacing from './styles/ISpacing';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: IColors;
    shapes: IShapes;
    spacing: ISpacing;
    name?: string;
  }
}
