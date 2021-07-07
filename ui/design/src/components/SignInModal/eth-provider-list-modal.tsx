import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import { ModalContainer } from './fullscreen-modal-container';

import Icon from '../Icon';
import { ModalCard } from '../EntryCard/basic-card-box';

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
}) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <Box width={{ max: '22rem', min: '30ch' }}>
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
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProvidersListModal;
