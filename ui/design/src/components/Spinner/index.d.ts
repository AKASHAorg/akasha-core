import * as React from 'react';
export interface SpinnerProps {
  /** the size (width, height) of the spinner. @default 50 */
  size?: number;
  /** speed (in seconds). ex: 1.2 or 2. @default 1.2 */
  speed?: number;
  style?: React.CSSProperties;
}
declare const Spinner: React.FC<SpinnerProps>;
export default Spinner;
