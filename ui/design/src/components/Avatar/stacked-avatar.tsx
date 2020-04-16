/* eslint-disable */
import * as React from 'react';
import { Stack } from 'grommet';
import { Avatar } from './index';

export interface IStackedAvatarProps {
  userData: { ethAddress: string; avatar?: string }[];
}

const StackedAvatar: React.FC<IStackedAvatarProps> = props => {
  const { userData } = props;

  const renderStack = (level: number) => {
    return (
      <Stack anchor="right">
        <Avatar ethAddress={userData[level].ethAddress} src={userData[level].avatar} size="xs" />
        {level + 1 < userData.length && renderStack(level + 1)}
      </Stack>
    );
  };

  return <>{renderStack(0)}</>;
};

export default StackedAvatar;
