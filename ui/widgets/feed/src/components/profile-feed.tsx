import * as React from 'react';
import type { IFeedWidgetProps } from './App';

export interface IProfileFeedProps extends IFeedWidgetProps {}

const ProfileFeed = (props: IProfileFeedProps) => {
  console.log(props.logger);

  return <>Profile Feed</>;
};

export default ProfileFeed;
