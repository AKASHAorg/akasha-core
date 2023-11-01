import * as React from 'react';
import { Extension } from './extension';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export const ModalExtension = () => {
  const { getModalFromParams } = useRootComponentProps();
  const getModalFromParamsRef = React.useRef(getModalFromParams);
  const [activeModal, setActiveModal] = React.useState<string>();

  React.useLayoutEffect(() => {
    window.addEventListener('single-spa:routing-event', () => {
      const modal = getModalFromParamsRef.current(location);
      if (activeModal && !modal) {
        setActiveModal(null);
      } else if (!activeModal && modal && modal.name) {
        setActiveModal(modal.name);
      }
    });
  }, [activeModal]);

  return <>{activeModal && <Extension name={activeModal} />}</>;
};
