import React from 'react';

import { PageHeader, IPageHeaderProps } from '../../../common';

export type IModerationActivityProps = IPageHeaderProps;

const ModerationActivity: React.FC<IModerationActivityProps> = props => {
  return <PageHeader {...props}></PageHeader>;
};

export default ModerationActivity;
