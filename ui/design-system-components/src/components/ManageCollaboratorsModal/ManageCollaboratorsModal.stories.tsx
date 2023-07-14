import React from 'react';

import ManageCollaboratorsModal from '.';
import { IManageCollaboratorsModalProps } from '.';

import { trendingProfilesData } from '../../utils/dummy-data';

export default {
  title: 'Modals/ManageCollaboratorsModal',
  component: ManageCollaboratorsModal,
  argTypes: {
    titleLabel: { control: 'text' },
    inputValue: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    titlenoCollaboratorsLabelLabel: { control: 'text' },
    noSearchItemsLabel: { control: 'text' },
    addButtonLabel: { control: 'text' },
    removeButtonLabel: { control: 'text' },
    onInputChange: { action: 'modal closed' },
    onSearch: { action: 'modal closed' },
    closeModal: { action: 'modal closed' },
    onClickCollaborator: { action: 'modal closed' },
    closeDrop: { action: 'modal closed' },
  },
};

const Template = (args: IManageCollaboratorsModalProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => {
          setModalOpen(true);
        }}
      />
      {modalOpen && <ManageCollaboratorsModal {...args} closeModal={() => setModalOpen(false)} />}
    </>
  );
};

export const BaseManageCollaboratorsModal = Template.bind({});

BaseManageCollaboratorsModal.args = {
  titleLabel: 'Collaborators',
  inputValue: '',
  inputPlaceholder: 'Search for a name or @name',
  collaborators: trendingProfilesData,
  searchResults: trendingProfilesData.slice(0, 2),
  noCollaboratorsLabel: 'You have not invited any collaborators yet',
  noSearchItemsLabel: "We couldn't find matching profiles",
  dropOpen: false,
  addButtonLabel: 'Add',
  removeButtonLabel: 'Remove',
};
