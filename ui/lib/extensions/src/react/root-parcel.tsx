import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

// Using mount root parcel until this pr is merged:
// https://github.com/single-spa/single-spa/pull/1189

export const RootParcel = props => {
  const { config, ...otherProps } = props;
  const { singleSpa } = useRootComponentProps();
  const parcel = React.useRef<ReturnType<typeof singleSpa.mountRootParcel>>(null);
  const parcelNodeRef = React.useRef();
  const isMounted = React.useRef(false);
  const isUnmounting = React.useRef(false);
  const singleSpaMountedConstant = React.useRef(singleSpa.MOUNTED);

  React.useEffect(() => {
    if (!parcelNodeRef.current || isMounted.current) return;
    parcel.current = singleSpa.mountRootParcel(config, {
      ...otherProps,
      domElement: parcelNodeRef.current,
    });
    isMounted.current = true;
  }, [config, otherProps, singleSpa]);

  React.useEffect(() => {
    if (parcel.current && parcel.current.getStatus() === singleSpaMountedConstant.current) {
      parcel.current.update?.(otherProps).catch(err => {
        console.error('failed to update parcel', err);
      });
    }
  }, [otherProps]);

  React.useEffect(() => {
    return () => {
      if (parcel.current && !isUnmounting.current) {
        isUnmounting.current = true;
        // parcel.current.unmount().catch(err => {
        //   console.error(err);
        // });
      }
    };
  }, []);

  return <div ref={parcelNodeRef}></div>;
};
