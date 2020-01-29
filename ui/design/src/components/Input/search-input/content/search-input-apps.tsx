import { Box, Image, Text } from 'grommet';
import * as React from 'react';
import { StyledSelectBox } from '../styled-search-input';

export interface ISearchInputAppsProps {
  apps: any[];
  onClickApp: (name: string) => void;
}

const SearchInputApps: React.FC<ISearchInputAppsProps> = props => {
  const { apps, onClickApp } = props;

  return (
    <Box
      pad={{
        horizontal: 'xxsmall',
        top: 'small',
        bottom: 'xxsmall',
      }}
    >
      {apps.map(({ name, imageUrl }: { name: string; imageUrl: string }, index: number) => (
        <StyledSelectBox
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => onClickApp(name)}
          key={index}
          round={{ size: 'xxsmall' }}
          height="40px"
          justify="center"
        >
          <Box
            margin={{ vertical: 'xsmall' }}
            direction="row"
            align="center"
            gap="xsmall"
            pad={{
              vertical: 'xxsmall',
              horizontal: 'small',
            }}
          >
            <Image width="32px" height="32px" src={imageUrl} style={{ borderRadius: '100%' }} />
            <Text size="large">{name}</Text>
          </Box>
        </StyledSelectBox>
      ))}
    </Box>
  );
};

export default SearchInputApps;
