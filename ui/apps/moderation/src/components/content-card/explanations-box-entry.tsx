import React from 'react';
import DS from '@akashaorg/design-system';
import { Logger } from '@akashaorg/awf-sdk';
import { useGetProfile, EntryReport } from '@akashaorg/ui-awf-hooks';

const { Text } = DS;

export interface IExplanationsBoxEntryProps {
  flagEntry: EntryReport;
  reportedByLabel: string;
  forLabel: string;
  logger: Logger;
}

const ExplanationsBoxEntry: React.FC<IExplanationsBoxEntryProps> = props => {
  const { flagEntry, reportedByLabel, forLabel } = props;

  const getProfileQuery = useGetProfile(flagEntry.author);

  return (
    <>
      {getProfileQuery.isLoading && <Text>Loading...</Text>}
      {getProfileQuery.isError && <Text>Error loading profile</Text>}
      {getProfileQuery.isSuccess && (
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
