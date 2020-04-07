import { Box, Text } from 'grommet';
import * as React from 'react';
import { AppIcon } from '../../../Icon/index';
import { SelectPopover } from '../../../Popovers/index';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';

export interface IProfileCardDescriptionProps {
  descriptionLabel: string;
  editable: boolean;
  description?: string;
  descriptionIcon?: LogoSourceType;
  descriptionPopoverOpen: boolean;
  setDescriptionPopoverOpen: (value: boolean) => void;
  handleChangeDescription: (provider: IProfileDataProvider) => void;
  profileProvidersData?: IProfileProvidersData;
}

const ProfileCardDescription: React.FC<IProfileCardDescriptionProps> = props => {
  const {
    editable,
    description,
    descriptionIcon,
    descriptionPopoverOpen,
    setDescriptionPopoverOpen,
    profileProvidersData,
    handleChangeDescription,
    descriptionLabel,
  } = props;

  const editDescriptionRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  return (
    <>
      <Box direction="column" pad="medium" gap="medium">
        <Box direction="row" gap="xsmall" align="center">
          <Text size="large" weight="bold" color="primaryText">
            {descriptionLabel}
          </Text>
          {editable &&
            profileProvidersData &&
            profileProvidersData.descriptionProviders &&
            profileProvidersData.descriptionProviders.length && (
              <AppIcon
                ref={editDescriptionRef}
                onClick={() => setDescriptionPopoverOpen(true)}
                appImg={descriptionIcon}
                placeholderIconType="editSimple"
              />
            )}
        </Box>

        <Text color="primaryText">{description}</Text>
      </Box>
      {editDescriptionRef.current &&
        descriptionPopoverOpen &&
        profileProvidersData &&
        profileProvidersData.descriptionProviders &&
        profileProvidersData.descriptionProviders.length && (
          <SelectPopover
            currentValue={description}
            target={editDescriptionRef.current}
            dataSource={profileProvidersData.descriptionProviders}
            onClickElem={handleChangeDescription}
            closePopover={() => {
              setDescriptionPopoverOpen(false);
            }}
          />
        )}
    </>
  );
};

export default ProfileCardDescription;
