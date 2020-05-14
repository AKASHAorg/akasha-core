import * as React from 'react';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { ModalCard } from '../../Cards';
import { Text } from 'grommet';

export interface IProviderModalProps {
  onModalClose: () => void;
  onLogin: () => void;
  headLine: string;
  message: string;
  illustration: React.ReactElement;
}

const ProviderAuthModal: React.FC<IProviderModalProps> = props => {
  React.useEffect(() => {
    props.onLogin();
  }, []);

  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard style={{ padding: '2em 4em' }}>
        {props.illustration}
        <Text weight="bold" size="large">
          {props.headLine}
        </Text>
        <Text style={{ marginBottom: '1em' }}>{props.message}</Text>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProviderAuthModal;
