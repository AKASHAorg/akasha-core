import React from 'react';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';
import { ILogger } from '@akashaproject/awf-sdk/typings/lib/interfaces/log';

const { Text } = DS;

export interface IExplanationsBoxEntryProps {
  // @TODO: add type
  entry: any;
  reportedByLabel: string;
  forLabel: string;
  logger: ILogger;
}

const ExplanationsCardEntry: React.FC<IExplanationsBoxEntryProps> = props => {
  const { entry, reportedByLabel, forLabel } = props;

  const [reporterProfileState, reporterProfileActions] = useProfile({
    onError: error => {
      props.logger.error(`[explanations-box-entry.tsx]: useProfile err, ${JSON.stringify(error)}`);
    },
  });

  React.useEffect(() => {
    if (entry.author) {
      // @TODO: replace ethAddress with pubkey
      reporterProfileActions.getProfileData({ ethAddress: entry.author });
    }
  }, [entry]);

  return (
    <>
      <Text as="p" margin={{ top: 'none', bottom: 'xxsmall' }}>
        {reportedByLabel}
        <Text as="span" margin={{ left: '0.2rem' }} color="accentText">
          {reporterProfileState.name
            ? reporterProfileState.name
            : `${entry.author.slice(0, 6)}...${entry.author.slice(entry.author.length - 4)}`}
        </Text>
        <Text as="span" margin={{ left: '0.2rem' }}>
          {forLabel}
        </Text>
        <Text as="span" margin={{ left: '0.2rem' }}>
          {entry.reason}
        </Text>
      </Text>
      <Text as="p" margin={{ top: 'none', bottom: 'medium' }} color="secondaryText">
        {entry.explanation}
      </Text>
    </>
  );
};

export default ExplanationsCardEntry;
