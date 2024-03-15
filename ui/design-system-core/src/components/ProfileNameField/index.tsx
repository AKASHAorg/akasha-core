import React from 'react';
import Text from '../Text';
import Tooltip from '../Tooltip';
import Stack from '../Stack';
import Icon from '../Icon';
import { ExclamationTriangleIcon } from '../Icon/hero-icons-outline';
import { getDidNetworkType, truncateDid } from '../../utils/did-utils';

export type ProfileNameFieldProps = {
  did: string;
  profileName?: string;
  truncateText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showMissingNameWarning?: boolean;
  missingNameWarningLabel?: string;
};

const ProfileNameField: React.FC<ProfileNameFieldProps> = ({
  did,
  profileName,
  truncateText,
  size = 'sm',
  showMissingNameWarning,
  missingNameWarningLabel,
}) => {
  const textTruncateStyle = `${truncateText ? 'max-w([7rem] xs:[2rem])' : ''}`;

  const networkType = getDidNetworkType(did);
  const truncatedDid = truncateDid(did, networkType);

  if (profileName) {
    return (
      <Text
        variant={`button-${size}`}
        weight="bold"
        truncate={true}
        customStyle={textTruncateStyle}
      >
        {profileName}
      </Text>
    );
  }
  return (
    <Stack direction="row" spacing="gap-2">
      <Text variant={`button-${size}`} weight="bold">
        {truncatedDid}
      </Text>
      {showMissingNameWarning && (
        <Tooltip
          placement="bottom"
          content={missingNameWarningLabel}
          trigger="click"
          customStyle="justify-center"
          contentCustomStyle="w-52"
        >
          <Icon
            icon={<ExclamationTriangleIcon />}
            color={{ light: 'errorLight', dark: 'errorDark' }}
          />
        </Tooltip>
      )}
    </Stack>
  );
};

export default ProfileNameField;
