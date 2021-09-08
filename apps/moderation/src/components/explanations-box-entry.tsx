import React from 'react';
import DS from '@akashaproject/design-system';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
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

  const getProfileQuery = useGetProfile(flagEntry.author);

  return (
    <>
      {getProfileQuery.status === 'loading' && <Text>Loading...</Text>}
      {getProfileQuery.status === 'error' && <Text>Error loading profile</Text>}
      {getProfileQuery.status === 'success' && (
        <>
          <Text as="p" margin={{ top: 'none', bottom: 'xxsmall' }}>
            {reportedByLabel}
            <Text as="span" margin={{ left: '0.2rem' }} color="accentText">
              {getProfileQuery.data.name
                ? getProfileQuery.data.name
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
      )}
    </>
  );
};

export default ExplanationsBoxEntry;
