import React from 'react';
import DS from '@akashaproject/design-system';

import { getFlags } from '../services/fetch-contents';

const { Box, Text, MainAreaCardBox } = DS;

export interface IExplanationsBoxProps {
  entryId: string;
  reportedByLabel: string;
  forLabel: string;
  logger: any;
}

const ExplanationsCard: React.FC<IExplanationsBoxProps> = props => {
  const { entryId, reportedByLabel, forLabel, logger } = props;

  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [flags, setFlags] = React.useState<any>([]);

  React.useEffect(() => {
    fetchContentFlags();
  }, []);

  const fetchContentFlags = async () => {
    setRequesting(true);
    try {
      const response = await getFlags(entryId);
      setFlags(response);
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      logger.error('[explanations-box.tsx]: fetchContentFlags err %j', error.message || '');
    }
  };

  return (
    <Box width="100%">
      {requesting && <Text>Loading ...</Text>}
      {!requesting && (
        <MainAreaCardBox>
          <Box pad="1rem" style={{ maxHeight: '8rem', overflowY: 'scroll' }}>
            {flags.map((flag: any) => (
              <>
                <Text as="p" margin={{ top: 'none', bottom: 'xxsmall' }}>
                  {reportedByLabel}
                  <Text
                    as="span"
                    margin={{ left: '0.2rem' }}
                    color="accentText"
                  >{`${flag.user.slice(0, 6)}...${flag.user.slice(flag.user.length - 4)}`}</Text>
                  <Text as="span" margin={{ left: '0.2rem' }}>
                    {forLabel}
                  </Text>
                  <Text as="span" margin={{ left: '0.2rem' }}>
                    {flag.reason}
                  </Text>
                </Text>
                <Text as="p" margin={{ top: 'none', bottom: 'xsmall' }} color="secondaryText">
                  {flag.explanation}
                </Text>
              </>
            ))}
          </Box>
        </MainAreaCardBox>
      )}
    </Box>
  );
};

export default ExplanationsCard;
