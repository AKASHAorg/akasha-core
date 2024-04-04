import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ManageCollaboratorsModal, {
  ManageCollaboratorsModalProps,
} from '../../components/ManageCollaboratorsModal';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { trendingProfilesData } from '../../utils/dummy-data';
import Button from '@akashaorg/design-system-core/lib/components/Button';

const Component: React.FC<ManageCollaboratorsModalProps> = props => {
  const [modalOpen, setModalOpen] = React.useState(true);

  return (
    <Stack direction="column" spacing="gap-y-2">
      <Button
        customStyle="w-fit"
        variant="secondary"
        label="show modal"
        onClick={() => {
          setModalOpen(true);
        }}
      />
      {modalOpen && <ManageCollaboratorsModal {...props} closeModal={() => setModalOpen(false)} />}
    </Stack>
  );
};

const meta: Meta<ManageCollaboratorsModalProps> = {
  title: 'DSComponents/Modals/ManageCollaboratorsModal',
  component: Component,
  tags: ['autodocs'],
  argTypes: {
    titleLabel: { control: 'text' },
    inputValue: { control: 'text' },
    collaborators: { control: 'object' },
    searchResults: { control: 'object' },
    noCollaboratorsLabel: { control: 'text' },
    noSearchItemsLabel: { control: 'text' },
    addButtonLabel: { control: 'text' },
    removeButtonLabel: { control: 'text' },
    closeModal: { action: 'modal closed' },
    onInputChange: { action: 'input changed' },
    onSearch: { action: 'searched' },
    onClickCollaborator: { action: 'collaborator clicked' },
    transformSource: { action: 'source tranformed' },
  },
};

type Story = StoryObj<ManageCollaboratorsModalProps>;

export const Default: Story = {
  args: {
    titleLabel: 'Collaborators',
    inputValue: '',
    collaborators: trendingProfilesData,
    searchResults: trendingProfilesData.slice(0, 2),
    noCollaboratorsLabel: 'You have not invited any collaborators yet',
    noSearchItemsLabel: "We couldn't find matching profiles",
    addButtonLabel: 'Add',
    removeButtonLabel: 'Remove',
    onInputChange: () => ({}),
    onSearch: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;
