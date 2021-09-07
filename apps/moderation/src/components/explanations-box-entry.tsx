import React from 'react';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';
import { ILogger } from '@akashaproject/awf-sdk/typings/lib/interfaces/log';

const { Text } = DS;

export type IFlagEntry = {
  _id: string;
  _mod: number;
  author: string;
  contentID: string;
  contentType: string;
  creationDate: number;
  explanation: string;
  reason: string;
};

export interface IExplanationsBoxEntryProps {
  flagEntry: IFlagEntry;
  reportedByLabel: string;
  forLabel: string;
  logger: ILogger;
}

const ExplanationsBoxEntry: React.FC<IExplanationsBoxEntryProps> = props => {
  const { flagEntry, reportedByLabel, forLabel } = props;

  const [reporterProfileState, reporterProfileActions] = useProfile({
    onError: error => {
      props.logger.error(`[explanations-box-entry.tsx]: useProfile err, ${JSON.stringify(error)}`);
    },
  });

  React.useEffect(() => {
    if (flagEntry.author) {
      reporterProfileActions.getProfileData({ pubKey: flagEntry.author });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagEntry]);

  return (
    <>
      <Text as="p" margin={{ top: 'none', bottom: 'xxsmall' }}>
        {reportedByLabel}
        <Text as="span" margin={{ left: '0.2rem' }} color="accentText">
          {reporterProfileState.name
            ? reporterProfileState.name
            : `${flagEntry.author.slice(0, 6)}...${flagEntry.author.slice(
                flagEntry.author.length - 4,
              )}`}
        </Text>
        <Text as="span" margin={{ left: '0.2rem' }}>
          {forLabel}
        </Text>
        <Text as="span" margin={{ left: '0.2rem' }}>
          {flagEntry.reason}
        </Text>
      </Text>
      <Text as="p" margin={{ top: 'none', bottom: 'medium' }} color="secondaryText">
        {flagEntry.explanation}
      </Text>
    </>
  );
};

export default ExplanationsBoxEntry;
