import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ModeratorListItem from './moderator-list-item';
import { PageHeaderProps, PageHeader } from '../common';

export type AssignAdminProps = PageHeaderProps & {
  introLabel: string;
  searchPlaceholderLabel: string;
  assignedAdmin: boolean;
  assignButtonLabel: string;
  activeModerators: Profile[];
  onClickAssign: () => void;
};

const AssignAdmin: React.FC<AssignAdminProps> = props => {
  const {
    introLabel,
    searchPlaceholderLabel,
    assignButtonLabel,
    activeModerators,
    assignedAdmin,
    onClickAssign,
  } = props;

  const selectedModerator = activeModerators[0];

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-6">
        <Text>{introLabel}</Text>

        {!assignedAdmin && (
          <AutoComplete
            options={activeModerators.map(el => el.name)}
            placeholder={searchPlaceholderLabel}
          />
        )}

        <ModeratorListItem
          assignedAdmin={assignedAdmin}
          assignButtonLabel={assignButtonLabel}
          activeModerators={activeModerators}
          selectedModerator={selectedModerator}
          onClickAssign={onClickAssign}
        />
      </Stack>
    </PageHeader>
  );
};

export default AssignAdmin;
