import React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, MainAreaCardBox } = DS;

export interface IContentTabProps {
  isPending: boolean;
  pendingLabel: string;
  moderatedLabel: string;
  countKept: number;
  countPending: number;
  countDelisted: number;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ISideProps {
  readonly right?: boolean;
}

const ContentTab: React.FC<IContentTabProps> = props => {
  const {
    isPending,
    pendingLabel,
    moderatedLabel,
    countKept,
    countPending,
    countDelisted,
    setIsPending,
  } = props;

  const handleTabClick = (value: boolean) => () => {
    setIsPending(value);
  };

  return (
    <>
      <Box margin={{ bottom: '1rem' }}>
        <MainAreaCardBox>
          <Box direction="row" pad={{ horizontal: '1rem' }} style={{ cursor: 'pointer' }}>
            <Box
              width="50%"
              pad={{ vertical: '1rem' }}
              border={{
                side: 'bottom',
                style: isPending ? 'solid' : 'hidden',
                color: 'accentText',
                size: 'xsmall',
              }}
              onClick={handleTabClick(true)}
            >
              <Text
                size="large"
                textAlign="center"
                color={isPending ? 'accentText' : 'secondaryText'}
              >
                {countPending} {pendingLabel}
              </Text>
            </Box>
            <Box
              width="50%"
              pad="1rem"
              border={{
                side: 'bottom',
                style: !isPending ? 'solid' : 'hidden',
                color: 'accentText',
                size: 'xsmall',
              }}
              onClick={handleTabClick(false)}
            >
              <Text
                size="large"
                textAlign="center"
                color={isPending ? 'secondaryText' : 'accentText'}
              >
                {countKept + countDelisted} {moderatedLabel}
              </Text>
            </Box>
          </Box>
        </MainAreaCardBox>
      </Box>
    </>
  );
};

export default ContentTab;
