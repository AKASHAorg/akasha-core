import React from 'react';
import DS from '@akashaorg/design-system';
import { ILogger } from '@akashaorg/typings/sdk';
import { useGetFlags, EntryReport } from '@akashaorg/ui-awf-hooks';
import ExplanationsBoxEntry, { IExplanationsBoxEntryProps } from './explanations-box-entry';

const { Box, Text } = DS;

export interface IExplanationsBoxProps extends Omit<IExplanationsBoxEntryProps, 'flagEntry'> {
  entryId: string;
  logger: ILogger;
}

const ExplanationsBox: React.FC<IExplanationsBoxProps> = props => {
  const { entryId, reportedByLabel, forLabel, logger } = props;

  const getFlagsQuery = useGetFlags(entryId);
  const flagEntries = getFlagsQuery.data;

  return (
    <Box width="100%">
      {getFlagsQuery.isLoading && <Text>Loading ...</Text>}
      {getFlagsQuery.isError && <Text>Error fetching flags</Text>}
      {getFlagsQuery.isSuccess && (
        <Box>
          {flagEntries.map((flagEntry: EntryReport, id: number) => (
            <ExplanationsBoxEntry
              key={id}
              flagEntry={flagEntry}
              reportedByLabel={reportedByLabel}
              forLabel={forLabel}
              logger={logger}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ExplanationsBox;
