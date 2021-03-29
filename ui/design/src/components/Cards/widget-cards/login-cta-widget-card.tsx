import * as React from 'react';
import { Box, Text, Image } from 'grommet';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

import { BasicCardBox } from '../common/basic-card-box';

const StyledText = styled(Text)`
  font-size: 1rem;
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
            <StyledText
              color="accentText"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                window.open(writeToUsUrl, writeToUsLabel, '_blank noopener noreferrer')
              }
            >
              {writeToUsLabel}
            </StyledText>{' '}
            {afterLinkLabel}
          </StyledText>
        </Box>
        <Box
          width={isMobile ? '60%' : '43%'}
          margin={{ ...(isMobile && { bottom: 'small' }) }}
          pad={{ ...(!isMobile && { right: 'small' }) }}
          alignSelf="center"
        >
          <Image fit="contain" src={`${publicImgPath}/login-widget-illustration.png`} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default LoginCTACard;
