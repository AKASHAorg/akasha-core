import * as React from 'react';
import styled from 'styled-components';
import { Box, Text, Image, Meter } from 'grommet';
import Icon from '../Icon';

export interface ITransparencyLogBannerProps {
  size: string;
  assetName: string;
  title: string;
  content: string;
  totalCountLabel: string;
  keptCount: number;
  keptCountLabel: string;
  delistedCount: number;
  delistedCountLabel: string;
  footerLabel: string;
  footerLinkLabel: string;
  footerLink: string;
  /* Path to public folder */
  publicImgPath?: string;
}

const StyledCircle = styled(Box)`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
`;

const StyledBox = styled(Box)`
  min-height: fit-content;
`;

const StyledText = styled(Text)`
  text-align: center;
  color: ${props => props.theme.colors.secondaryText};
`;

const TransparencyLogBanner: React.FC<ITransparencyLogBannerProps> = props => {
  const {
    size,
    assetName,
    title,
    content,
    keptCount,
    delistedCount,
    keptCountLabel,
    totalCountLabel,
    delistedCountLabel,
    footerLabel,
    footerLinkLabel,
    footerLink,
    publicImgPath = '/images',
  } = props;

  const stats = [
    { count: keptCount + delistedCount, label: totalCountLabel, color: 'grey' },
    { count: keptCount, label: keptCountLabel, color: 'green' },
    { count: delistedCount, label: delistedCountLabel, color: 'red' },
  ];

  const handleClickCodeOfConduct = () => {
    window.open(footerLink, '_blank');
  };

  return (
    <Box pad="large">
      <Box height={size} width={size} margin={{ bottom: 'small' }} alignSelf="center">
        <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
      </Box>
      <StyledBox>
        <Text size="xlarge" textAlign="center" weight="bold">
          {title}
        </Text>
        <StyledText size="large" margin={{ top: 'xsmall' }}>
          {content}
        </StyledText>
        <StyledBox
          direction="row"
          margin={{ vertical: 'xlarge', horizontal: 'auto' }}
          pad="0.15rem"
        >
          <Meter
            type="circle"
            aria-label="meter"
            size="xsmall"
            thickness="xlarge"
            round={true}
            values={[
              {
                value: delistedCount,
                color: 'red',
                label: delistedCountLabel,
              },
              {
                value: keptCount,
                color: 'green',
                label: keptCountLabel,
              },
            ]}
          />
          <Box margin={{ left: 'large' }} justify="around">
            {stats.map(el => (
              <Box key={el.count + el.label} direction="row" align="center">
                <StyledCircle border={{ size: '0.2rem', color: el.color }} />
                <StyledText size="large" margin={{ left: 'xsmall' }}>
                  {`${Number(el.count).toLocaleString()} ${el.label}`}
                </StyledText>
              </Box>
            ))}
          </Box>
        </StyledBox>
      </StyledBox>
      <Box border={{ color: 'border', side: 'bottom', style: 'solid' }} />
      <Box margin={{ top: 'large' }}>
        <StyledText>{footerLabel}</StyledText>
        <Box
          direction="row"
          wrap={true}
          align="center"
          justify="center"
          margin={{ top: 'medium', bottom: 'xlarge' }}
          onClick={handleClickCodeOfConduct}
        >
          <Text color="accentText" margin={{ right: '0.25rem', bottom: '0.2rem' }}>
            {footerLinkLabel}
          </Text>
          <Icon type="arrowRight" accentColor={true} clickable={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default TransparencyLogBanner;
