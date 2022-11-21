import * as React from 'react';
import { Anchor, Box, Text, Image } from 'grommet';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';

const StyledText = styled(Text)`
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
`;

export const CTAAnchor = styled(Anchor)<{ isBold?: boolean }>`
  color: ${props => props.theme.colors.accentText};
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
  font-weight: ${props =>
    props.isBold ? props.theme.shapes.fontWeight.bold : props.theme.shapes.fontWeight.regular};
  &:hover {
    text-decoration: none;
  }
`;

export interface ILoginWidgetCardProps {
  onWriteToUsLabelClick?: () => void;
  title: string;
  subtitle: string;
  beforeLinkLabel: string;
  afterLinkLabel: string;
  writeToUsLabel: string;
  disclaimerLabel?: string;
  writeToUsUrl: string;
  image?: React.ReactElement;
  publicImgPath?: string;
  onCloseIconClick?: () => void;
}
const LoginCTACard: React.FC<ILoginWidgetCardProps> = props => {
  const {
    title,
    subtitle,
    beforeLinkLabel,
    afterLinkLabel,
    writeToUsLabel,
    disclaimerLabel,
    writeToUsUrl,
    publicImgPath = '/images',
    onWriteToUsLabelClick,
    onCloseIconClick,
  } = props;
  return (
    <BasicCardBox pad="medium" callToAction={true}>
      {props.image}
      <Box align="flex-start" justify="between" direction="row">
        <Box direction={isMobile ? 'column-reverse' : 'row'} align="center" justify="between">
          <Box direction="column" width={isMobile ? '100%' : '50%'} gap="xsmall">
            <Text weight="bold" size="1rem" margin={{ top: 'xsmall' }}>
              {title}
            </Text>
            <StyledText>{subtitle}</StyledText>
            <StyledText>
              {beforeLinkLabel}
              <CTAAnchor
                size="medium"
                href={writeToUsUrl}
                label={writeToUsLabel}
                onClick={onWriteToUsLabelClick}
              />
              {afterLinkLabel}
            </StyledText>
            <StyledText>{disclaimerLabel}</StyledText>
          </Box>
          <Box
            width={isMobile ? '100%' : '43%'}
            margin={{ ...(isMobile && { bottom: 'small' }) }}
            pad={{ ...(!isMobile && { right: 'small' }) }}
          >
            <Image
              style={{ width: '100%', ...(isMobile && { width: '60%', alignSelf: 'center' }) }}
              fit="contain"
              src={`${publicImgPath}/login-widget-illustration.webp`}
            />
          </Box>
        </Box>
        <Icon type="close" clickable={true} onClick={onCloseIconClick} size="xs" />
      </Box>
    </BasicCardBox>
  );
};

export default LoginCTACard;
