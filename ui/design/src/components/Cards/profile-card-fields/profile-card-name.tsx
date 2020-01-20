import { Text, TextInput } from 'grommet';
import * as React from 'react';
import { getEditableTextFieldHandlers } from '../../../utils/get-editable-field-handlers';
import { IProfileData } from '../profile-widget-card';

export interface IProfileCardNameProps {
  profileData: IProfileData;
  editable: boolean;
  onChangeProfileData: (newProfileData: IProfileData) => void;
}

const ProfileCardName: React.FC<IProfileCardNameProps> = props => {
  const { profileData, editable, onChangeProfileData } = props;

  const [editName, setEditName] = React.useState(false);
  const [newName, setNewName] = React.useState(profileData.name);
  const { handleClick, handleBlur, handleChange } = getEditableTextFieldHandlers(
    editable,
    setEditName,
    setNewName,
    () =>
      onChangeProfileData({
        ...profileData,
        name: newName,
      }),
  );

  return (
    <>
      {!editName && (
        <Text size="xlarge" weight="bold" color="primaryText" onClick={handleClick}>
          {newName}
        </Text>
      )}

      {editName && (
        <TextInput
          plain={true}
          name="name"
          size="xlarge"
          color="primaryText"
          value={newName}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default ProfileCardName;
