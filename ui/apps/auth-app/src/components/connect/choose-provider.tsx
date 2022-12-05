import * as React from 'react';
import DS, { BoxExtendedProps } from '@akashaorg/design-system';
import { Share } from 'grommet-icons';

import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';

const {
  Box,
  Web3ConnectCard,
  HorizontalDivider,
  Accordion,
  AccordionPanel,
  Heading,
  Text,
  Icon,
  Anchor,
  styled,
} = DS;

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

const StyledBox: React.FC<BoxExtendedProps> = styled(Box)`
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    width: 100%;
    > div: {
      padding-left: 0;
      padding-right: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

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
          <Accordion background={{ dark: 'dark-4', light: 'light-0' }}>
            <AccordionPanel
              style={{}}
              label={
                <Text color="secondaryText" style={{ width: '100%' }}>
                  {accordionTitle}
                </Text>
              }
            >
              <Text margin={{ bottom: '1rem' }}>{accordionContent}</Text>
              <HorizontalDivider />
              <Box
                flex={true}
                direction="column"
                pad="small"
                justify="center"
                align="center"
                margin="auto"
              >
                <Heading
                  level="6"
                  size="small"
                  textAlign="center"
                  margin={{ top: '1rem', bottom: 'none' }}
                >
                  {accordionFooter}
                </Heading>
                <Box
                  flex={true}
                  direction="row"
                  justify="center"
                  align="center"
                  margin={{ bottom: '0.5rem' }}
                >
                  <Icon type="metamask" color="initial" size={'md'} plain={true} />
                  <Anchor
                    size="medium"
                    href={accordionFooterCTAUrl}
                    label={accordionFooterCTA}
                    target="_blank"
                    margin={{ left: '0.5rem', right: '0.5rem' }}
                  />
                  <Share color="plain" size="medium" />
                </Box>
              </Box>
            </AccordionPanel>
          </Accordion>
          {injectedProvider.name !== INJECTED_PROVIDERS.NOT_DETECTED && (
            <Box margin={{ vertical: 'xsmall' }}>
              <Web3ConnectCard
                leftIconType={injectedProvider.details.iconType}
                titleLabel={injectedProvider.details.titleLabel}
                subtitleLabel={injectedProvider.details.subtitleLabel}
                iconBackground="#fef5e6"
                handleClick={handleProviderClick(EthProviders.Web3Injected)}
              />
            </Box>
          )}
          <Box margin={{ vertical: 'xsmall' }}>
            <Web3ConnectCard
              leftIconType="walletconnect"
              subtitleLabel={wcSubtitleLabel}
              titleLabel="WalletConnect"
              iconBackground="#52a4fc"
              handleClick={handleProviderClick(EthProviders.WalletConnect)}
            />
          </Box>
        </Box>
      </StyledBox>

      <Box align="center" width="90%" responsive={true} margin="auto">
        <Text textAlign="start" size="medium" color="secondaryText" margin={{ top: '1rem' }}>
          {footerLabel}
          {footerCTAArr.map((cta, idx) => (
            <React.Fragment key={cta.label + idx}>
              <Anchor size="medium" href={cta.href} label={cta.label} target={'_blank'} />
              {cta.delimiter}
            </React.Fragment>
          ))}
        </Text>
      </Box>
    </>
  );
};

export default ChooseProvider;
