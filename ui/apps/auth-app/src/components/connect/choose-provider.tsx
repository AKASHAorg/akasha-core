import * as React from 'react';
import DS from '@akashaorg/design-system';
import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';

import { StyledAccordionPanel, StyledBox } from './styles';

const { Box, Web3ConnectCard, HorizontalDivider, Accordion, Heading, Text, Icon, Anchor } = DS;

interface ChooseProviderProps {
  titleLabel: string;
  subtitleLabel: string;
  infoLabel: string;
  accordionTitle: string;
  accordionContent: string;
  accordionFooter: string;
  accordionFooterCTA: string;
  accordionFooterCTAUrl: string;
  wcSubtitleLabel: string;
  footerLabel: string;
  footerCTAArr: { href: string; label: string; delimiter: string }[];
  injectedProvider: {
    name: INJECTED_PROVIDERS;
    details: {
      iconType?: string;
      titleLabel?: string;
      subtitleLabel?: string;
    };
  };
  onProviderSelect: (provider: EthProviders) => void;
}

const ChooseProvider: React.FC<ChooseProviderProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    infoLabel,
    accordionTitle,
    accordionContent,
    accordionFooter,
    accordionFooterCTA,
    accordionFooterCTAUrl,
    wcSubtitleLabel,
    footerLabel,
    footerCTAArr,
    injectedProvider,
    onProviderSelect,
  } = props;

  const handleProviderClick = (provider: EthProviders) => () => {
    onProviderSelect(provider);
  };

  return (
    <>
      <StyledBox align="center" width="70%" responsive={true} margin="auto" gap="small">
        <Heading
          style={{ userSelect: 'none', width: '100%' }}
          level="4"
          size="medium"
          textAlign="center"
          fill={true}
          margin={{ bottom: 'none' }}
        >
          {titleLabel}
        </Heading>
        <Text size="medium" color="secondaryText">
          {subtitleLabel}
        </Text>

        <Box direction="column" pad="small" style={{ width: '100%' }}>
          <Heading level="5" size="small" textAlign="start" margin={{ bottom: '0.5rem' }}>
            {infoLabel}
          </Heading>
          <Accordion background={{ dark: 'dark-4', light: 'light-0' }} margin={{ bottom: '1rem' }}>
            <StyledAccordionPanel
              label={
                <Text color="secondaryText" style={{ width: '100%' }}>
                  {accordionTitle}
                </Text>
              }
            >
              <Text margin={{ bottom: '1rem' }} textAlign="justify">
                {accordionContent}
              </Text>
              <HorizontalDivider />
              <Box flex={true} direction="column" pad="medium" justify="center" align="center">
                <Heading
                  level="6"
                  size="small"
                  textAlign="center"
                  margin={{ top: 'none', bottom: '1.1rem' }}
                >
                  {accordionFooter}
                </Heading>
                <Box
                  flex={true}
                  direction="row"
                  justify="center"
                  align="center"
                  pad={{ bottom: 'none' }}
                >
                  <Box
                    pad="0.25rem"
                    background="lightGold"
                    margin={{ right: 'xsmall' }}
                    style={{ borderRadius: '10%' }}
                  >
                    <Icon type="metamask" size={'md'} plain={true} />
                  </Box>
                  <Anchor
                    size="medium"
                    href={accordionFooterCTAUrl}
                    label={accordionFooterCTA}
                    target="_blank"
                    margin={{ left: '0.5rem', right: '0.5rem' }}
                  />
                  <Icon type="expand" size="lg" plain={true} />
                </Box>
              </Box>
              <HorizontalDivider />
            </StyledAccordionPanel>
          </Accordion>
          {injectedProvider.name !== INJECTED_PROVIDERS.NOT_DETECTED && (
            <Box margin={{ vertical: 'xsmall' }}>
              <Web3ConnectCard
                leftIconType={injectedProvider.details.iconType}
                titleLabel={injectedProvider.details.titleLabel}
                subtitleLabel={injectedProvider.details.subtitleLabel}
                iconBackground="lightGold"
                handleClick={handleProviderClick(EthProviders.Web3Injected)}
              />
            </Box>
          )}
          <Box margin={{ vertical: 'xsmall' }}>
            <Web3ConnectCard
              leftIconType="walletconnect"
              subtitleLabel={wcSubtitleLabel}
              titleLabel="WalletConnect"
              iconBackground="deepBlue"
              handleClick={handleProviderClick(EthProviders.WalletConnect)}
            />
          </Box>
        </Box>
      </StyledBox>

      <StyledBox align="center" width="90%" responsive={true} margin="auto">
        <Text textAlign="start" size="medium" color="secondaryText" margin={{ top: '1rem' }}>
          {footerLabel}
          {footerCTAArr.map((cta, idx) => (
            <React.Fragment key={cta.label + idx}>
              <Anchor size="medium" href={cta.href} label={cta.label} target={'_blank'} />
              {cta.delimiter}
            </React.Fragment>
          ))}
        </Text>
      </StyledBox>
    </>
  );
};

export default ChooseProvider;
