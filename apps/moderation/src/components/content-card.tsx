import React from 'react';
import moment from 'moment';
import DS from '@akashaproject/design-system';

import { StyledBox } from './styled';

const { Box, Icon, Text, Avatar, Button, MainAreaCardBox } = DS;

export interface IContentCardProps {
  reportedLabel: string;
  contentType: string;
  forLabel: string;
  additionalDescLabel: string;
  additionalDescContent?: string;
  reportedByLabel: string;
  ethAddress?: string;
  reasons: string[];
  reporterName?: string;
  reporterENSName?: string;
  reportedOnLabel: string;
  dateTime: string;
  keepContentLabel: string;
  delistContentLabel: string;
  handleButtonClick: (param1: string, param2: string, param3: string, param4: string[]) => void;
}

const ContentCard: React.FC<IContentCardProps> = props => {
  const {
    reportedLabel,
    contentType,
    forLabel,
    additionalDescLabel,
    additionalDescContent,
    reportedByLabel,
    ethAddress,
    reasons,
    reporterName,
    reporterENSName,
    reportedOnLabel,
    dateTime,
    keepContentLabel,
    delistContentLabel,
    handleButtonClick,
  } = props;

  const handleClick = (action: string) => () => {
    if (ethAddress) {
      handleButtonClick(ethAddress, action, contentType, reasons);
    }
  };

  return (
    <Box margin={{ bottom: '1rem' }}>
      <MainAreaCardBox>
        <Box pad="1rem">
          <MainAreaCardBox>
            {contentType === 'post' ? (
              <Box height="25rem">Insert Post EntryBox here ...</Box>
            ) : contentType === 'profile' ? (
              <Box height="25rem">Insert ProfileCard here ...</Box>
            ) : null}
          </MainAreaCardBox>
          <Box direction="row" margin={{ top: 'large' }} wrap={true} align="center">
            <Icon type="error" size="md" accentColor={true} />
            <Text
              margin={{ left: '0.2rem', bottom: '0.2rem' }}
            >{`${reportedLabel} ${contentType} ${forLabel}`}</Text>
            {reasons.map((reason, idx) => (
              <StyledBox
                key={idx}
                margin={{ left: '0.2rem', bottom: '0.2rem' }}
                pad={{ horizontal: '0.2rem' }}
                round={'0.125rem'}
              >
                <Text as="span" color="accentText">
                  {reason}
                </Text>
              </StyledBox>
            ))}
          </Box>
          <Text margin={{ top: 'large', bottom: 'xsmall' }}>{additionalDescLabel}:</Text>
          {additionalDescContent && <Text>{additionalDescContent}</Text>}
          <Box
            direction="row"
            margin={{ top: 'medium' }}
            pad={{ top: 'medium' }}
            align="center"
            border={{ side: 'top', color: 'border', style: 'solid' }}
          >
            <Box width="65%">
              <Box direction="row">
                <Text>{reportedByLabel}</Text>
                <Avatar
                  ethAddress={ethAddress || ''}
                  src="https://placebeard.it/360x360"
                  size="xs"
                  margin={{ left: '0.2rem' }}
                  backgroundColor={'lightBackground'}
                  border="sm"
                />
                {reporterName && (
                  <Text margin={{ left: '0.2rem' }} color="accentText">
                    {reporterName}
                  </Text>
                )}
                {reporterENSName && <Text margin={{ left: '0.2rem' }}>({reporterENSName})</Text>}
              </Box>
              <Text color="secondaryText">{`${reportedOnLabel} ${moment(dateTime).format(
                'D MMM yyyy hh:mm',
              )}`}</Text>
            </Box>
            <Box direction="row" width="35%" justify="end">
              <Button
                margin={{ right: 'xsmall' }}
                label={keepContentLabel}
                onClick={handleClick('Keep')}
              />
              <Button primary={true} label={delistContentLabel} onClick={handleClick('Delist')} />
            </Box>
          </Box>
        </Box>
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
