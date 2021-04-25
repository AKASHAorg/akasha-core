import * as React from 'react';
import { Anchor, Box, Text, Image } from 'grommet';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

import { BasicCardBox } from '../EntryCard/basic-card-box';

const StyledText = styled(Text)`
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
`;

const StyledAnchor = styled(Anchor)`
  color: ${props => props.theme.colors.accent};
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
  font-weight: ${props => props.theme.shapes.fontWeight.regular};
  &:hover {
    text-decoration: none;
  }
`;

export interface ILoginWidgetCardProps {
  onLearnMoreClick?: () => void;
  title: string;
  subtitle: string;
  beforeLinkLabel: string;
  afterLinkLabel: string;
  writeToUsLabel: string;
  writeToUsUrl: string;
  image?: React.ReactElement;
  publicImgPath?: string;
}
const LoginCTACard: React.FC<ILoginWidgetCardProps> = props => {
  const {
    title,
    subtitle,
    beforeLinkLabel,
    afterLinkLabel,
    writeToUsLabel,
    writeToUsUrl,
    publicImgPath = '/images',
  } = props;
  return (
    <BasicCardBox pad="medium" callToAction={true}>
      {props.image && props.image}
      <Box direction={isMobile ? 'column-reverse' : 'row'} align="center" justify="between">
        <Box direction="column" width={isMobile ? '100%' : '50%'}>
          <Text weight="bold" size="1rem" margin={{ top: 'xsmall' }}>
            {title}
          </Text>
          <StyledText margin={{ top: 'xsmall' }}>{subtitle}</StyledText>
          <StyledText margin={{ top: 'xsmall' }}>
            {beforeLinkLabel}{' '}
            <StyledAnchor size="medium" href={writeToUsUrl} label={writeToUsLabel} />{' '}
            {afterLinkLabel}
          </StyledText>
        </Box>
        <Box
          width={isMobile ? '100%' : '43%'}
          margin={{ ...(isMobile && { bottom: 'small' }) }}
          pad={{ ...(!isMobile && { right: 'small' }) }}
        >
          <Image
            style={{ width: '100%', ...(isMobile && { width: '60%', alignSelf: 'center' }) }}
            fit="contain"
            src={`${publicImgPath}/login-widget-illustration.png`}
          />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default LoginCTACard;
