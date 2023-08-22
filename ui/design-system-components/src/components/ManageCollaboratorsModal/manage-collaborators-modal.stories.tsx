import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ManageCollaboratorsModal, { ManageCollaboratorsModalProps } from '.';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import { trendingProfilesData } from '../../utils/dummy-data';

const meta: Meta<ManageCollaboratorsModalProps> = {
  title: 'DSComponents/Modals/ManageCollaboratorsModal',

  component: ManageCollaboratorsModal,
};

export default meta;
type Story = StoryObj<ManageCollaboratorsModalProps>;

const Component = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <Stack direction="column" spacing="gap-y-2">
      <button
        onClick={() => {
          setModalOpen(true);
        }}
      />
      {modalOpen && (
        <ManageCollaboratorsModal
          titleLabel="Collaborators"
          inputValue=""
          collaborators={trendingProfilesData}
          searchResults={trendingProfilesData.slice(0, 2)}
          noCollaboratorsLabel="You have not invited any collaborators yet"
          noSearchItemsLabel="We couldn't find matching profiles"
          addButtonLabel="Add"
          removeButtonLabel="Remove"
          closeModal={() => setModalOpen(false)}
          onInputChange={() => ({})}
          onSearch={() => ({})}
          onClickCollaborator={() => null}
        />
      )}
    </Stack>
  );
};

export const BaseManageCollaboratorsModal: Story = {
  render: () => <Component />,
};
