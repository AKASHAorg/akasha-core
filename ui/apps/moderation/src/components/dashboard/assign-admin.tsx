import React from 'react';

import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ModeratorListItem from './moderator-list-item';
import PageHeader, { IPageHeaderProps } from './page-header';
import { ActiveModerator } from '../../utils/dummy-data';

export interface IAssignAdminProps extends IPageHeaderProps {
  introLabel: string;
  searchPlaceholderLabel: string;
  assignButtonLabel: string;
  activeModerators: ActiveModerator[];
  onClickAssign: () => void;
}

const AssignAdmin: React.FC<IAssignAdminProps> = props => {
  const {
    introLabel,
    searchPlaceholderLabel,
    assignButtonLabel,
    activeModerators,
    showButtons,
    onClickAssign,
  } = props;

  const selectedModerator = activeModerators[0];

  return (
    <PageHeader {...props}>
      <Box customStyle="space-y-6">
        <Text>{introLabel}</Text>
        {!props.showButtons && (
          <AutoComplete
            type="text"
            options={activeModerators.map(el => el.name)}
            placeholder={searchPlaceholderLabel}
          />
        )}
        <ModeratorListItem
          showButtons={showButtons}
          assignButtonLabel={assignButtonLabel}
          activeModerators={activeModerators}
          selectedModerator={selectedModerator}
          onClickAssign={onClickAssign}
        />
      </Box>
    </PageHeader>
  );
};

export default AssignAdmin;
