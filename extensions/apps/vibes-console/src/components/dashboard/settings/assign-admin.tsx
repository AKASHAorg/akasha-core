import React from 'react';
import { Profile } from '@akashaorg/typings/lib/ui';
import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import ModeratorListItem from '../moderator-list-item';
import { NoItemFound } from '../../no-item-found';

export type AssignAdminProps = PageHeaderProps & {
  introLabel: string;
  searchPlaceholderLabel: string;
  assignedAdmin: boolean;
  assignButtonLabel: string;
  activeModerators: Profile[];
  onClickAssign: () => void;
};

export const AssignAdmin: React.FC<AssignAdminProps> = props => {
  const {
    introLabel,
    searchPlaceholderLabel,
    assignButtonLabel,
    activeModerators,
    assignedAdmin,
    onClickAssign,
  } = props;
  return (
    <PageHeader {...props}>
      <Stack spacing={6} className="mb-8">
        <Typography>{introLabel}</Typography>
        {!assignedAdmin && (
          <AutoComplete
            options={activeModerators.map(el => el.name)}
            placeholder={searchPlaceholderLabel}
          />
        )}
        {!activeModerators.length && (
          <NoItemFound title="No active moderators found. Please add some moderators first and try again later" />
        )}
        {!!activeModerators.length && (
          <ModeratorListItem
            assignedAdmin={assignedAdmin}
            assignButtonLabel={assignButtonLabel}
            activeModerators={activeModerators}
            selectedModerator={activeModerators[0]}
            onClickAssign={onClickAssign}
          />
        )}
      </Stack>
    </PageHeader>
  );
};
