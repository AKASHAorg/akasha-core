import * as React from 'react';
export interface IViewportDimProps {
  children: React.ReactElement;
}
declare const ViewportSizeProvider: ({ children }: IViewportDimProps) => JSX.Element;
export declare const useViewportSize: () => {
  dimensions: {
    width: number;
    height: number;
  };
  size: string;
};
export default ViewportSizeProvider;
