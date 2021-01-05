import React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, styled, Button, MainAreaCardBox } = DS;

export interface IContentTabProps {
  isPending: boolean;
  isDelisted: boolean;
  pendingLabel: string;
  moderatedLabel: string;
  count: number;
  countLabel: string;
  keptLabel: string;
  delistedLabel: string;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelisted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ISideProps {
  readonly right?: boolean;
}

const StyledButton = styled(Button)<ISideProps>`
  border-radius: ${props =>
    props.right ? '0.25rem 0rem 0rem 0.25rem' : '0rem 0.25rem 0.25rem 0rem'};
`;

const ContentTab: React.FC<IContentTabProps> = props => {
  const {
    isPending,
    isDelisted,
    pendingLabel,
    moderatedLabel,
    count,
    countLabel,
    keptLabel,
    delistedLabel,
    setIsPending,
    setIsDelisted,
  } = props;

  const handleTabClick = () => {
    setIsPending(!isPending);
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
              onClick={handleTabClick}
            >
              <Text textAlign="center" color={isPending ? 'accentText' : 'secondaryText'}>
                {pendingLabel}
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
                {moderatedLabel}
              </Text>
            </Box>
          </Box>
        </MainAreaCardBox>
      </Box>
      {!isPending && !!count && (
        <Box margin={{ bottom: '1rem' }}>
          <MainAreaCardBox>
            <Box direction="row" pad="1rem" justify="between" align="center">
              <Text>
                {count} {countLabel}
              </Text>
              <Box direction="row">
                <StyledButton
                  right
                  primary={!isDelisted}
                  label={keptLabel}
                  onClick={() => setIsDelisted(false)}
                />
                <StyledButton
                  primary={isDelisted}
                  label={delistedLabel}
                  onClick={() => setIsDelisted(true)}
                />
              </Box>
            </Box>
          </MainAreaCardBox>
        </Box>
      )}
    </>
  );
};

export default ContentTab;
