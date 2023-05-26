import React from 'react';

import { PageHeader, IPageHeaderProps } from '../../../common';

export type IApplicationsActivityProps = IPageHeaderProps;

const ApplicationsActivity: React.FC<IApplicationsActivityProps> = props => {
  return <PageHeader {...props}></PageHeader>;
};

export default ApplicationsActivity;
