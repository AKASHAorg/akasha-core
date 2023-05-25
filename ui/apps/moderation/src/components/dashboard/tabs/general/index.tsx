import React from 'react';
import dayjs from 'dayjs';

import { IconType } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import {
  EDIT_CATEGORIES,
  EDIT_CONTACT_INFO,
  EDIT_MAX_APPLICANTS,
  RESIGN_ROLE,
} from '../../../../routes';

export type IGeneralTabProps = {
  isAdmin?: boolean;
  moderatorSinceLabel: string;
  moderatorSince: number;
  moderationCategoriesLabel: string;
  noCategoriesLabel: string;
  moderationCategories: string[];
  contactInfoLabel: string;
  contactInfoIntroLabel: string;
  contactInfo: { type: IconType; value: string }[];
  maxApplicantsLabel: string;
  maxApplicantsIntroLabel: string;
  currentNumberLabel: string;
  maxApplicants: number;
  moderationDutiesLabel: string;
  moderationDutiesDescLabel: string;
  changeLabel: string;
  resignButtonLabel: string;
  onButtonClick: (route?: string) => () => void;
};

export const GeneralTab: React.FC<IGeneralTabProps> = props => {
  const {
    isAdmin,
    moderatorSinceLabel,
    moderatorSince,
    moderationCategoriesLabel,
    noCategoriesLabel,
    moderationCategories,
    contactInfoLabel,
    contactInfoIntroLabel,
    contactInfo,
    maxApplicantsLabel,
    maxApplicantsIntroLabel,
    currentNumberLabel,
    maxApplicants,
    moderationDutiesLabel,
    moderationDutiesDescLabel,
    changeLabel,
    resignButtonLabel,
    onButtonClick,
  } = props;

  return (
    <Box customStyle="p-4 space-y-4">
      <Box customStyle="flex items-center justify-between">
        <Text weight="bold">{moderatorSinceLabel}</Text>
        <Text color="grey4">{dayjs(moderatorSince).format('DD-MMM-YYYY')}</Text>
      </Box>

      <Divider />

      <Box customStyle="flex flex-col">
        <Box customStyle="flex items-center justify-between">
          <Text weight="bold">{moderationCategoriesLabel}</Text>

          <Button plain={true} onClick={onButtonClick(EDIT_CATEGORIES)}>
            <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {changeLabel}
            </Text>
          </Button>
        </Box>
        {moderationCategories.length > 0 ? (
          <Box customStyle="flex flex-wrap">
            {moderationCategories.map((category, idx) => (
              <Pill key={category + idx} label={category} active={true} customStyle="mt-3 mr-3" />
            ))}
          </Box>
        ) : (
          <Text>{noCategoriesLabel}</Text>
        )}
      </Box>

      <Divider />

      <Box customStyle="flex flex-col space-y-3">
        <Box customStyle="flex items-center justify-between ">
          <Text weight="bold">{contactInfoLabel}</Text>

          <Button plain={true} onClick={onButtonClick(EDIT_CONTACT_INFO)}>
            <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {changeLabel}
            </Text>
          </Button>
        </Box>

        <Text>{contactInfoIntroLabel}</Text>

        <Box customStyle="space-y-2">
          {contactInfo.map(({ type, value }) => (
            <Box key={type + value} customStyle="flex items-center space-x-2">
              <Button icon={type} variant="primary" greyBg={true} iconOnly={true} size="sm" />

              <Text>{value}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      {isAdmin && (
        <>
          <Box customStyle="flex flex-col space-y-3">
            <Box customStyle="flex items-center justify-between">
              <Text weight="bold">{maxApplicantsLabel}</Text>

              <Button plain={true} onClick={onButtonClick(EDIT_MAX_APPLICANTS)}>
                <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                  {changeLabel}
                </Text>
              </Button>
            </Box>

            <Text>{maxApplicantsIntroLabel}</Text>

            <Box customStyle="flex space-x-3">
              <Text
                weight="bold"
                color={{ light: 'black', dark: 'grey6' }}
              >{`${currentNumberLabel}:`}</Text>
              <Text>{maxApplicants}</Text>
            </Box>
          </Box>

          <Divider />
        </>
      )}

      <Box customStyle="flex flex-col space-y-3">
        <Text weight="bold">{moderationDutiesLabel}</Text>
        <Text>{moderationDutiesDescLabel}</Text>

        <Button
          size="md"
          label={resignButtonLabel}
          customStyle="self-end mt-3"
          onClick={onButtonClick(RESIGN_ROLE)}
        />
      </Box>
    </Box>
  );
};
