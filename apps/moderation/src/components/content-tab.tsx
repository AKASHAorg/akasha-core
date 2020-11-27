import React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, MainAreaCardBox } = DS;

export interface IContentTabProps {
  isPending: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContentTab: React.FC<IContentTabProps> = props => {
  const { isPending, setIsPending } = props;

  const handleTabClick = () => {
    setIsPending(!isPending);
  };

  return (
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
            onClick={handleTabClick}
          >
            <Text textAlign="center" color={isPending ? 'accentText' : 'secondaryText'}>
              Pending
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
            onClick={handleTabClick}
          >
            <Text textAlign="center" color={isPending ? 'secondaryText' : 'accentText'}>
              Delisted
            </Text>
          </Box>
        </Box>
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentTab;
