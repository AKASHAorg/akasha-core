import * as React from 'react';
import responsiveBreakpoints from '../../styles/responsive-breakpoints';

const breakpoints = responsiveBreakpoints.global.breakpoints;

const ViewportSizeCtx = React.createContext({});
const getSizeByWidth = (width: number) => {
  const size = Object.keys(breakpoints).reduce((prev, curr) => {
    if (breakpoints[prev].value - width <= 0) {
      return curr;
    }
    return prev;
  });
  return size;
};

export interface IViewportDimProps {
  children: React.ReactElement;
}
const ViewportSizeProvider = ({ children }: IViewportDimProps) => {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [size, setSize] = React.useState(getSizeByWidth(dimensions.width));

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setSize(getSizeByWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <ViewportSizeCtx.Provider value={{ dimensions, size }}>{children}</ViewportSizeCtx.Provider>
  );
};
export const useViewportSize = () => React.useContext(ViewportSizeCtx);
export default ViewportSizeProvider;
