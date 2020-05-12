import * as React from 'react';
import { ModalContainer } from './modal-container';
import DS from '@akashaproject/design-system';

const { ModalCard, Text } = DS;

export interface IMetamaskAuthModalProps {
  onLogin?: () => void;
  onModalClose: () => void;
  headLine: string;
  message: string;
  illustration: React.ReactElement;
}

export const MetamaskAuthModal: React.FC<IMetamaskAuthModalProps> = props => {
  React.useEffect(() => {
    if (props.onLogin) {
      props.onLogin();
    }
  }, []);
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard style={{ padding: '1em 4em' }}>
        {props.illustration}
        <Text weight="bold" size="large">
          {props.headLine}
        </Text>
        <Text style={{ marginBottom: '1em' }}>{props.message}</Text>
      </ModalCard>
    </ModalContainer>
  );
};
