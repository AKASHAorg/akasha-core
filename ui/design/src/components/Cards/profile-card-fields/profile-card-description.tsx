import { Text, TextArea } from 'grommet';
import * as React from 'react';

import { getEditableTextFieldHandlers } from '../../../utils/get-editable-field-handlers';
import { IProfileData } from '../profile-card';

export interface IProfileCardDescriptionProps {
  profileData: IProfileData;
  editable: boolean;
  onChangeProfileData: (newProfileData: IProfileData) => void;
}

const ProfileCardDescription: React.FC<IProfileCardDescriptionProps> = props => {
  const { profileData, editable, onChangeProfileData } = props;

  const [editDescription, setEditDescription] = React.useState(false);
  const [newDescription, setNewDescription] = React.useState(profileData.description);
  const { handleClick, handleBlur, handleChange } = getEditableTextFieldHandlers(
    editable,
    setEditDescription,
    setNewDescription,
    () =>
      onChangeProfileData({
        ...profileData,
        description: newDescription,
      }),
  );

  return (
    <>
      {!editDescription && (
        <Text color="primaryText" onClick={handleClick}>
          {newDescription}
        </Text>
      )}
      {editDescription && (
        <TextArea
          plain={true}
          name="description"
          color="primaryText"
          onBlur={handleBlur}
          onChange={handleChange}
        >
          {newDescription}
        </TextArea>
      )}
    </>
  );
};

export default ProfileCardDescription;
