import { Text } from 'grommet';
import * as React from 'react';
import { AppIcon } from '../../Icon/app-icon';
import { SelectPopover } from '../../Popovers/index';
import { IProfileDataProvider, IProfileProvidersData } from '../';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
import { StyledInlineBox } from '../styled-profile-card';

export interface IProfileCardNameProps {
  editable: boolean;
  name?: string;
  nameIcon?: LogoSourceType;
  namePopoverOpen: boolean;
  setNamePopoverOpen: (value: boolean) => void;
  handleChangeName: (provider: IProfileDataProvider) => void;
  profileProvidersData?: IProfileProvidersData;
}

const ProfileCardName: React.FC<IProfileCardNameProps> = props => {
  const {
    editable,
    name,
    nameIcon,
    namePopoverOpen,
    setNamePopoverOpen,
    profileProvidersData,
    handleChangeName,
  } = props;

  const editNameRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  return (
    <>
      <StyledInlineBox direction="row" gap="xsmall" align="center">
        <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
          {name}
        </Text>
        {editable &&
          profileProvidersData &&
          profileProvidersData.nameProviders &&
          profileProvidersData.nameProviders.length !== 0 && (
            <AppIcon
              ref={editNameRef}
              onClick={() => setNamePopoverOpen(!namePopoverOpen)}
              appImg={nameIcon}
              placeholderIconType="editSimple"
              size="xs"
            />
          )}
      </StyledInlineBox>
      {editNameRef.current &&
        profileProvidersData &&
        profileProvidersData.nameProviders &&
        profileProvidersData.nameProviders.length !== 0 &&
        namePopoverOpen && (
          <SelectPopover
            currentValue={name}
            target={editNameRef.current}
            dataSource={profileProvidersData.nameProviders}
            onClickElem={handleChangeName}
            closePopover={() => {
              setNamePopoverOpen(false);
            }}
          />
        )}
    </>
  );
};

export default ProfileCardName;
