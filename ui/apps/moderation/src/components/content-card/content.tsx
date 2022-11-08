import React from 'react';
import moment from 'moment';

import DS from '@akashaorg/design-system';
import { getMediaUrl } from '@akashaorg/ui-awf-hooks';

import EntryDataCard from './entry-data-card';
import ExplanationsBox from './explanations-box';

import { IContentProps } from '../../interfaces';
import getReasonPrefix from '../../utils/getReasonPrefix';

const { Avatar, Box, Button, Icon, Text, styled, useViewportSize } = DS;

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.hoverBackground};
`;

const ContentCardButton = styled(Button)`
  height: auto;
  padding: 0.3rem 0.6rem;
  border-width: 0.1rem;
`;

const Content: React.FC<IContentProps> = props => {
  const [showExplanations, setShowExplanations] = React.useState<boolean>(false);

  const { size } = useViewportSize();

  const isMobile = size === 'small';

  const handleClick = () => {
    if (props.entryId) {
      props.handleButtonClick(props.entryId, props.itemType);
    }
  };

  const handleCopy = (value: string) => () => {
    navigator.clipboard.writeText(value);
  };

  const avatarIpfsLinks = getMediaUrl(props.reporterAvatar);

  return (
    <Box>
      {/* incident label */}
      <Box
        direction="row"
        pad="medium"
        gap="xsmall"
        round={{ size: 'xsmall', corner: 'top' }}
        background="warning"
      >
        <Text size="large">{`${props.incidentLabel} # ${getReasonPrefix(
          props.reasons[0],
        )}-${props.entryId.slice(0, 26)}`}</Text>
        <Icon
          type="copy"
          color="secondaryText"
          style={{ cursor: 'pointer' }}
          onClick={handleCopy(props.entryId)}
        />
      </Box>

      {/* rest of the content card */}
      <Box pad="medium" gap="medium">
        <Box direction="row" wrap={true} align="center">
          <Text margin={{ left: '0.2rem', bottom: '0.2rem' }} size="large" weight={600}>{`${
            props.itemType && props.itemType[0].toUpperCase()
          }${props.itemType.slice(1)} ${props.reportedLabel}  ${props.forLabel}`}</Text>

          {props.reasons.map((reason, idx) => (
            <React.Fragment key={idx}>
              {/* show 'and' at the appropriate position, if more than one reason */}
              {props.reasons.length > 1 && idx === props.reasons.length - 1 && (
                <Text margin={{ left: '0.2rem', bottom: '0.2rem' }} size="large" weight={600}>
                  {props.andLabel}
                </Text>
              )}
              <StyledBox
                margin={{ left: '0.2rem', bottom: '0.2rem' }}
                pad={{ horizontal: '0.2rem' }}
                round={'0.125rem'}
              >
                <Text as="span" color="accentText" size="large" weight={600}>
                  {reason}
                </Text>
              </StyledBox>
            </React.Fragment>
          ))}
        </Box>

        {props.entryData && (
          <EntryDataCard
            modalSlotId={props.layoutConfig.modalSlotId}
            entryData={props.entryData}
            itemType={props.itemType}
            locale={props.locale}
            navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
          />
        )}

        <Text
          as="a"
          color="accentText"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowExplanations(!showExplanations)}
        >
          {showExplanations ? props.hideExplanationsLabel : props.showExplanationsLabel}
        </Text>
        {showExplanations && (
          <ExplanationsBox
            entryId={props.entryId}
            reportedByLabel={props.reportedByLabel}
            forLabel={props.forLabel}
            logger={props.logger}
          />
        )}
        <Box
          direction={isMobile ? 'column' : 'row'}
          pad={{ top: props.isPending ? 'medium' : '0rem' }}
          align="center"
          border={
            props.isPending ? { side: 'top', color: 'border', style: 'solid' } : { size: '0rem' }
          }
        >
          <Box width={props.isPending && !isMobile ? '70%' : '100%'}>
            <Box direction="row" align="center" gap="xxsmall" wrap={true}>
              <Text>{props.originallyReportedByLabel}</Text>

              <Avatar
                ethAddress={props.reporter || ''}
                src={{
                  url: avatarIpfsLinks?.originLink,
                  fallbackUrl: avatarIpfsLinks?.fallbackLink,
                }}
                size="xs"
                backgroundColor="lightBackground"
                border="sm"
              />

              {props.reporter && !props.reporterName && (
                <Text color="accentText">
                  {`${props.reporter.slice(0, 6)}...${props.reporter.slice(
                    props.reporter.length - 4,
                  )}`}
                </Text>
              )}

              {props.reporterName && <Text color="accentText">{props.reporterName}</Text>}

              {props.reporterENSName && (
                <Text color={!props.isPending ? 'secondaryText' : 'primaryText'}>
                  {`(@${props.reporterENSName})`}
                </Text>
              )}

              {props.otherReporters && !!props.otherReporters.length && (
                <>
                  <Text>{props.andLabel}</Text>
                  <Text color="accentText">{props.otherReporters}</Text>
                </>
              )}
            </Box>
            <Text color="secondaryText">{`${props.reportedOnLabel} ${moment(
              props.reportedDateTime,
            ).format('D MMM yyyy・h:mm a')}`}</Text>
          </Box>
          {props.isPending && (
            <Box
              direction="row"
              width={isMobile ? '100%' : '30%'}
              margin={isMobile ? 'small' : '0rem'}
              justify="end"
            >
              <ContentCardButton
                primary={true}
                label={props.makeADecisionLabel}
                onClick={handleClick}
              />
            </Box>
          )}
        </Box>
        {!props.isPending && (
          <Box margin={{ top: 'medium' }} border={{ side: 'top', color: 'border', style: 'solid' }}>
            <Text margin={{ top: 'large' }} style={{ fontWeight: 'bold' }}>
              {props.determinationLabel}
              {': '}
              <Text as="span" color="accentText">
                {props.determination}
              </Text>
            </Text>
            <Text margin={{ top: 'xsmall' }}>{props.moderatorDecision}</Text>
            <Box
              direction={isMobile ? 'column' : 'row'}
              margin={{ top: 'large' }}
              align={isMobile ? 'start' : 'center'}
            >
              <Box width={!isMobile ? '70%' : '100%'} wrap={true}>
                <Text>
                  {props.moderator && !props.moderatorName
                    ? `${props.moderatedByLabel} ${props.moderator.slice(
                        0,
                        6,
                      )}...${props.moderator.slice(
                        props.moderator.length - 5,
                        props.moderator.length - 1,
                      )}`
                    : `${props.moderatedByLabel} ${props.moderatorName} ${
                        props.moderatorENSName ? `(@${props.moderatorENSName})` : ''
                      }`}
                </Text>
                <Text color="secondaryText">{`${props.moderatedOnLabel} ${moment(
                  props.evaluationDateTime,
                ).format('D MMM yyyy・h:mm a')}`}</Text>
              </Box>
              <Box
                direction="row"
                margin={isMobile ? 'small' : '0rem'}
                width={isMobile ? '100%' : '30%'}
                justify="end"
              >
                <ContentCardButton label={props.reviewDecisionLabel} onClick={handleClick} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Content;
