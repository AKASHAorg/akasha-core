import React, { useState } from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';

import {
  ActivityTab,
  ApplicationsTab,
  GeneralTab,
  ActivityTabProps,
  ApplicationsTabProps,
  GeneralTabProps,
} from './tabs';

export type ModeratorDashboardProps = GeneralTabProps &
  ApplicationsTabProps &
  ActivityTabProps & {
    isAdmin: boolean;
    tabLabels: string[];
  };

const ModeratorDashboard: React.FC<ModeratorDashboardProps> = props => {
  const { tabLabels, isAdmin } = props;

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card padding="p-0 pt-4">
      <Tab value={activeTab} onChange={setActiveTab} labels={tabLabels} labelTextVariant="body1">
        {/* General tab */}
        <GeneralTab {...props} />

        {/* Applications tab */}
        {isAdmin && <ApplicationsTab {...props} />}

        {/* Activity tab */}
        <ActivityTab {...props} />
      </Tab>
    </Card>
  );
};

export default ModeratorDashboard;
