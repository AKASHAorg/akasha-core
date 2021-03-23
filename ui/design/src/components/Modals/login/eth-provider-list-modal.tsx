import * as React from 'react';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { Box, Text } from 'grommet';
import { ModalCard } from '../../Cards';
import styled from 'styled-components';
import { Icon } from '../../Icon';
import LinkInput from '../../Input/text-input-icon-form/index';

const WalletProviderButton = styled(Box)`
  flex: 1;
  cursor: pointer;
  user-select: none;
`;

export interface IProviderInfo {
  id: string;
  logo: React.ReactElement | string;
  title: string;
  description: string;
}
const ProvidersListModal = (props: {
  onModalClose: () => void;
  onProviderClick: (providerId: string) => void;
  providers: IProviderInfo[];
  showSignUp?: {
    inviteToken: string | null;
    status: boolean;
  };
  titleLabel: string;
  inputPlaceholder?: string;
  submitted?: boolean;
  submitting?: boolean;
  success?: boolean;
  hasError?: boolean;
  errorMsg?: string;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  validateTokenFn?: (ev: any) => void;
}) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <Box width={{ max: '22rem', min: '30ch' }}>
          {props?.showSignUp?.status && (
            <>
              <Box align="center" justify="center" pad="small">
                <Text weight="bold" size="xlarge">
                  {'Please enter here your '}
                </Text>
                <Text weight="bold" size="xlarge">
                  {'invitation code'}
                </Text>
              </Box>
              <Box align="center" justify="center" pad="small">
                <LinkInput inputValue={props?.showSignUp?.inviteToken || ''} {...props} />
                {props.errorMsg && props.hasError && (
                  <Text color={'status-critical'}>{props.errorMsg}</Text>
                )}
              </Box>
            </>
          )}
          {(!props?.showSignUp?.status || props?.success) && (
            <>
              <Box align="center" justify="center" pad="small">
                <Text weight="bold" size="xlarge">
                  {props.titleLabel}
                </Text>
              </Box>
              <Box direction="column">
                {props.providers.map(provider => (
                  <WalletProviderButton
                    direction="row"
                    gap="small"
                    align="center"
                    justify="between"
                    pad="small"
                    margin="small"
                    onClick={() => props.onProviderClick(provider.id)}
                    key={provider.id}
                    border={{ color: 'accent', side: 'all' }}
                    round="xxsmall"
                  >
                    <Box>{provider.logo}</Box>
                    <Box>
                      <Text color="accentColor">{provider.description}</Text>
                    </Box>
                    <Icon type="arrowRight" size="xs" />
                  </WalletProviderButton>
                ))}
              </Box>
            </>
          )}
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProvidersListModal;
