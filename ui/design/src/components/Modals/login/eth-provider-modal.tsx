import * as React from 'react';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { ModalCard } from '../../Cards';
import { Box, Text } from 'grommet';
import { Icon } from '../../Icon';

export interface IProviderModalProps {
  onModalClose: () => void;
  onLogin: () => void;
  headLine: string;
  message: string;
  illustration: React.ReactElement;
  error: string | null;
}

const ProviderAuthModal: React.FC<IProviderModalProps> = props => {
  React.useEffect(() => {
    props.onLogin();
  }, []);

  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard style={{ padding: '2em 4em' }}>
        {props.illustration}
        <Box align="center" gap="xsmall">
          <Text weight="bold" size="medium">
            {props.headLine}
          </Text>
          <Text style={{ marginBottom: '2em' }}>{props.message}</Text>
          {!props.error && <Icon type="loading" accentColor={true} size="md" />}
          {props.error && (
            <Text size="small" color="errorText">
              {props.error}
            </Text>
          )}
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProviderAuthModal;
