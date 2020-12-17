import { IAkashaError } from '@akashaproject/ui-awf-typings';
import * as React from 'react';

export interface ModalState {
  loginModal: boolean;
  [key: string]: boolean;
}

export interface UseModalStateProps {
  /**
   * initial state of the hook
   * loginModal is added by default
   */
  initialState: Omit<ModalState, 'loginModal'>;
  /* a boolean that indicates if the user is logged in or not */
  isLoggedIn: boolean;
  onError?: (err: IAkashaError) => void;
}

export interface ModalStateActions {
  /* show modal immediately */
  show: (modalKey: string) => void;
  /* show a modal after the login modal */
  showAfterLogin: (modalKey: string) => void;
  /* hide a modal */
  hide: (modalKey: string) => void;
}

const useModalState = (props: UseModalStateProps): [ModalState, ModalStateActions] => {
  const [modalState, setModalState] = React.useState<ModalState>({
    loginModal: false,
    ...props.initialState,
  });

  const [modalQueue, setModalQueue] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (props.isLoggedIn && modalState.loginModal) {
      setModalState(prev => ({ ...prev, loginModal: false }));
      if (modalQueue.length) {
        const newQueueState = modalQueue.slice();
        const modalKey = newQueueState.shift() as string;
        setModalState(prev => ({ ...prev, [modalKey]: true }));
        setModalQueue(newQueueState);
      }
    }
  }, [props.isLoggedIn]);

  const handleErrors = (err: IAkashaError) => {
    if (props.onError) {
      props.onError(err);
    }
  };
  const actions: ModalStateActions = {
    show: modalKey => setModalState(prevState => ({ ...prevState, [modalKey]: true })),
    showAfterLogin: modalKey => {
      setModalQueue(prev => {
        if (prev.indexOf(modalKey) > -1) {
          handleErrors({
            errorKey: 'useModalState.showAfterLogin',
            error: new Error(`modalKey ${modalKey} already in queue`),
            critical: false,
          });
          return prev;
        }
        return [...prev, modalKey];
      });
    },
    hide: modalKey => setModalState(prevState => ({ ...prevState, [modalKey]: false })),
  };
  return [modalState, actions];
};

export default useModalState;
