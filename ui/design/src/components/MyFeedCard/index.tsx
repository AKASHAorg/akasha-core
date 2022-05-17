import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobile } from 'react-device-detect';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  cursor: pointer;
`;

export interface MyFeedCardProps {
  title: string;
  description: string;
  noPostsTitle: string;
  noPostsDescription: string;
  CTALabel: string;
  onClickCTA: () => void;
  hasPosts: boolean;
}

export const MyFeedCard: React.FC<MyFeedCardProps> = props => {
  const { title, description, noPostsTitle, noPostsDescription, CTALabel, onClickCTA, hasPosts } =
    props;
  return (
    <BasicCardBox>
      <Box align="center" pad={{ vertical: 'large', horizontal: 'medium' }}>
        {!hasPosts && (
          <>
            <Icon
              type="quote"
              size={isMobile ? 'xl' : 'xxl'}
              strokeWidth={isMobile ? 0.5 : 0.6}
              accentColor
            />
            <Text size="large" weight={600} textAlign="center" margin={{ top: 'large' }}>
              {noPostsTitle}
            </Text>

            <Text size="large" textAlign="center" margin={{ vertical: 'large' }}>
              {noPostsDescription}
            </Text>
          </>
        )}
        {hasPosts && (
          <>
            <Text size="large" weight={600} textAlign="center" margin={{ top: 'large' }}>
              {title}
            </Text>

            <Text size="large" textAlign="center" margin={{ vertical: 'large' }}>
              {description}
            </Text>
          </>
        )}
      </Box>
      <Box align="end" pad="medium">
        <StyledBox direction="row" onClick={onClickCTA}>
          <Text size="large" color="accentText">
            {CTALabel}
          </Text>
          <Icon type="chevronRight" accentColor={true} />
        </StyledBox>
      </Box>
    </BasicCardBox>
  );
};
