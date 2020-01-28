import { Box, Image, Text } from 'grommet';
import * as React from 'react';

import { StyledSelectBox } from '../styled-input';

export interface ISearchInputUsersProps {
  users: any[];
  onClickUser: (name: string) => void;
}

const SearchInputUsers: React.FC<ISearchInputUsersProps> = props => {
  const { users, onClickUser } = props;

  return (
    <Box
      pad={{
        horizontal: 'xxsmall',
        top: 'small',
        bottom: 'xxsmall',
      }}
    >
      {users.map(({ name, imageUrl }: { name: string; imageUrl: string }, index: number) => (
        <StyledSelectBox
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => onClickUser(name)}
          key={index}
          round={{ size: 'xxsmall' }}
          height="2.5em"
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
            <Image width="2em" height="2em" src={imageUrl} style={{ borderRadius: '100%' }} />
            <Text size="large">{name}</Text>
          </Box>
        </StyledSelectBox>
      ))}
    </Box>
  );
};

export default SearchInputUsers;
