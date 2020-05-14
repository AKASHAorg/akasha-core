import * as React from 'react';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { HorizontalDivider } from '../../Dividers';
import { Box, Text } from 'grommet';
import { ModalCard } from '../../Cards';
import styled from 'styled-components';

const WalletProviderButton = styled(Box)`
  padding: 1.75em;
  flex: 1;
  margin: 1em;
  cursor: pointer;
  user-select: none;
`;

// @ts-ignore-next-line
const StyledWalletList = styled(Box)`
  ${WalletProviderButton}:nth-child(2) {
    border-left: 1px solid ${props => props.theme.colors.border};
  }
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
  footer: React.ReactElement;
}) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <StyledWalletList direction="row">
          {props.providers.map(provider => (
            <WalletProviderButton
              align="center"
              onClick={() => props.onProviderClick(provider.id)}
              key={provider.id}
            >
              <Box>{provider.logo}</Box>
              <Box>
                <Text weight="bold" size="large" margin={{ top: '1em' }}>
                  {provider.title}
                </Text>
              </Box>
              <Box>
                <Text textAlign="center">{provider.description}</Text>
              </Box>
            </WalletProviderButton>
          ))}
        </StyledWalletList>
        <HorizontalDivider />
        <Box>{props.footer}</Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProvidersListModal;
