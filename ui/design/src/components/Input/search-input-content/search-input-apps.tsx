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
        horizontal: '4px',
        top: '12px',
        bottom: '4px',
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
            margin={{ vertical: '8px' }}
            direction="row"
            align="center"
            gap="8px"
            pad={{
              vertical: '4px',
              horizontal: '12px',
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
