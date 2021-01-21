import React from 'react';
import moment from 'moment';
import DS from '@akashaproject/design-system';

import { IContentProps } from '../../interfaces';

import EntryDataCard from '../entry-data-card';
import ExplanationsCard from '../explanations-box';

import { StyledBox } from '../styled';

const { Box, Icon, Text, Avatar, Button } = DS;

const Content: React.FC<IContentProps> = props => {
  const [showExplanations, setShowExplanations] = React.useState<boolean>(false);

  const handleClick = () => () => {
    if (props.entryId) {
      props.handleButtonClick(props.entryId, props.contentType);
    }
  };

  return (
    <Box pad="1rem">
      {props.entryData && (
        <EntryDataCard
          entryData={props.entryData}
          contentType={props.contentType}
          locale={props.locale}
        />
      )}
      <Box
        direction="row"
        margin={{ top: props.isPending ? 'large' : 'medium' }}
        wrap={true}
        align="center"
      >
        <Icon type="error" size="md" accentColor={true} />
        <Text margin={{ left: '0.2rem', bottom: '0.2rem' }} style={{ fontWeight: 'bold' }}>{`${
          props.contentType && props.contentType[0].toUpperCase()
        }${props.contentType.slice(1)} ${props.reportedLabel}  ${props.forLabel}`}</Text>

        {props.reasons.map((reason, idx) => (
          <>
            {/* show 'and' at the appropriate position, if more than one reason */}
            {props.reasons.length > 1 && idx === props.reasons.length - 1 && (
              <Text margin={{ left: '0.2rem', bottom: '0.2rem' }} style={{ fontWeight: 'bold' }}>
                {props.andLabel}
              </Text>
            )}
            <StyledBox
              key={idx}
              margin={{ left: '0.2rem', bottom: '0.2rem' }}
              pad={{ horizontal: '0.2rem' }}
              round={'0.125rem'}
            >
              <Text as="span" color="accentText" style={{ fontWeight: 'bold' }}>
                {reason}
              </Text>
            </StyledBox>
          </>
        ))}
      </Box>

      <Text
        as="a"
        color="accentText"
        margin={{ top: 'large' }}
        style={{ cursor: 'pointer' }}
        onClick={() => setShowExplanations(!showExplanations)}
      >
        {showExplanations ? props.hideExplanationsLabel : props.showExplanationsLabel}
      </Text>
      {showExplanations && (
        <ExplanationsCard
          entryId={props.entryId}
          reportedByLabel={props.reportedByLabel}
          forLabel={props.forLabel}
          logger={props.logger}
        />
      )}
      <Box
        direction="row"
        margin={{ top: 'medium' }}
        pad={{ top: props.isPending ? 'medium' : '0rem' }}
        align="center"
        border={
          props.isPending ? { side: 'top', color: 'border', style: 'solid' } : { size: '0rem' }
        }
      >
        <Box width={props.isPending ? '75%' : '100%'}>
          <Box direction="row">
            <Text>{props.originallyReportedByLabel}</Text>
            <Avatar
              ethAddress={props.reporter || ''}
              src="https://placebeard.it/360x360"
              size="xs"
              margin={{ left: '0.2rem' }}
              backgroundColor={'lightBackground'}
              border="sm"
            />
            {props.reporter && (
              <Text margin={{ left: '0.2rem' }} color="accentText">
                {`${props.reporter.slice(0, 6)}...${props.reporter.slice(
                  props.reporter.length - 4,
                )}`}
              </Text>
            )}
            {props.reporterName && (
              <Text margin={{ left: '0.2rem' }} color="accentText">
                {props.reporterName}
              </Text>
            )}
            {props.reporterENSName && (
              <Text
                margin={{ left: '0.2rem' }}
                color={!props.isPending ? 'secondaryText' : 'initial'}
              >
                ({props.reporterENSName})
              </Text>
            )}
            {props.otherReporters && !!props.otherReporters.length && (
              <>
                <Text margin={{ left: '0.2rem' }}>{props.andLabel}</Text>
                <Text margin={{ left: '0.2rem' }} color="accentText">
                  {props.otherReporters}
                </Text>
              </>
            )}
          </Box>
          <Text color="secondaryText">{`${props.reportedOnLabel} ${moment(
            props.reportedDateTime,
          ).format('D MMM yyyy・h:mm a')}`}</Text>
        </Box>
        {props.isPending && (
          <Box direction="row" width="25%" justify="end">
            <Button primary={true} label={props.makeADecisionLabel} onClick={handleClick()} />
          </Box>
        )}
      </Box>
      {!props.isPending && (
        <Box margin={{ top: 'medium' }} border={{ side: 'top', color: 'border', style: 'solid' }}>
          {!props.isPending && (
            <>
              <Text margin={{ top: 'large' }} style={{ fontWeight: 'bold' }}>
                {props.determinationLabel}
                {': '}
                <Text as="span" color="accentText">
                  {props.determination}
                </Text>
              </Text>
              <Text margin={{ top: 'xsmall' }}>{props.moderatorDecision}</Text>
            </>
          )}
          <Box direction="row" margin={{ top: 'large' }} justify="between" align="end">
            <Box>
              <Text>
                {props.moderator
                  ? `${props.moderatedByLabel} ${props.moderator.slice(
                      0,
                      6,
                    )}...${props.moderator.slice(
                      props.moderator.length - 5,
                      props.moderator.length - 1,
                    )}`
                  : `${props.moderatedByLabel} ${props.moderatorName} (${props.moderatorENSName})`}
              </Text>
              <Text color="secondaryText">{`${props.moderatedOnLabel} ${moment(
                props.evaluationDateTime,
              ).format('D MMM yyyy・h:mm a')}`}</Text>
            </Box>
            <Box direction="row" width="35%" justify="end">
              <Button label={props.reviewDecisionLabel} onClick={() => null} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Content;
