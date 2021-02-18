import * as React from 'react';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { Box, Text } from 'grommet';
import { ModalCard } from '../../Cards';
import styled from 'styled-components';
import { Icon } from '../../Icon';

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
  titleLabel: string;
}) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <Box width={{ max: '22rem' }}>
          <Box align="center" justify="center" pad="large">
            <Text weight="bold" size="large">
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
                round="xsmall"
              >
                <Box>{provider.logo}</Box>
                <Box>
                  <Text color="accentColor">{provider.description}</Text>
                </Box>
                <Icon type="arrowRight" size="xs" />
              </WalletProviderButton>
            ))}
          </Box>
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProvidersListModal;
