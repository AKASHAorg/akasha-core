import { Box, Text } from 'grommet';
import * as React from 'react';
import { AppIcon } from '../../Icon/app-icon';
import SelectPopover from '../../SelectPopover';
import { IProfileDataProvider, IProfileProvidersData } from '../';
import { LogoSourceType } from '@akashaorg/ui-awf-typings/lib/index';

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
      <Box direction="column" pad={{ vertical: 'xsmall', horizontal: 'medium' }} gap="xxsmall">
        <Box direction="row" gap="xxsmall" align="center">
          <Text size="large" weight="bold" color="primaryText" style={{ lineHeight: 1.7 }}>
            {descriptionLabel}
          </Text>
          {editable &&
            profileProvidersData &&
            profileProvidersData.descriptionProviders &&
            profileProvidersData.descriptionProviders.length && (
              <AppIcon
                ref={editDescriptionRef}
                onClick={() => setDescriptionPopoverOpen(!descriptionPopoverOpen)}
                appImg={descriptionIcon}
                placeholderIconType="editSimple"
                size="xs"
              />
            )}
        </Box>

        <Text color="primaryText" size="large" style={{ lineHeight: 1.7 }} wordBreak="break-word">
          {description}
        </Text>
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
