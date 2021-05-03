import * as React from 'react';
import { Box, Text } from 'grommet';

import { ModalContainer } from './fullscreen-modal-container';

import Icon from '../Icon';
import { ModalCard } from '../EntryCard/basic-card-box';

export interface IProviderModalProps {
  onModalClose: () => void;
  onLogin: () => void;
  headLine: string;
  message: string;
  illustration: React.ReactElement;
  error: string | null;
  isMobile?: boolean;
}

const ProviderAuthModal: React.FC<IProviderModalProps> = props => {
  React.useEffect(() => {
    props.onLogin();
  }, []);

  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <Box width={props.isMobile ? { max: '22rem' } : 'auto'}>
        <ModalCard style={{ padding: '2em 4em' }}>
          {!props.isMobile && props.illustration}
          <Box align="center" gap="xsmall">
            <Text weight="bold" size="medium">
              {props.headLine}
            </Text>
            <Text textAlign="center" style={{ marginBottom: '1.5rem' }}>
              {props.message}
            </Text>
            {!props.error && <Icon type="loading" accentColor={true} size="md" />}
            {props.error && (
              <Text textAlign="center" size="small" color="errorText">
                {props.error}
              </Text>
            )}
          </Box>
        </ModalCard>
      </Box>
    </ModalContainer>
  );
};

export default ProviderAuthModal;
