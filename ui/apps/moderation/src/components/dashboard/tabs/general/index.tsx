import React from 'react';
import dayjs from 'dayjs';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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

export type GeneralTabProps = {
  isAdmin?: boolean;
  moderatorSinceLabel: string;
  moderatorSince: number;
  moderationCategoriesLabel: string;
  noCategoriesLabel: string;
  moderationCategories: string[];
  contactInfoLabel: string;
  contactInfoIntroLabel: string;
  contactInfo: { icon: React.ReactElement; solid?: boolean; value: string }[];
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

export const GeneralTab: React.FC<GeneralTabProps> = props => {
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
    <Stack spacing="gap-y-4">
      <Stack direction="row" align="center" justify="between">
        <Text variant="button-md" weight="bold">
          {moderatorSinceLabel}
        </Text>
        <Text variant="footnotes2" color="grey4">
          {dayjs(moderatorSince).format('DD-MMM-YYYY')}
        </Text>
      </Stack>

      <Divider />

      <Stack>
        <Stack direction="row" align="center" justify="between">
          <Text variant="button-md" weight="bold">
            {moderationCategoriesLabel}
          </Text>

          <Button plain={true} onClick={onButtonClick(EDIT_CATEGORIES)}>
            <Text
              variant="button-md"
              weight="bold"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            >
              {changeLabel}
            </Text>
          </Button>
        </Stack>
        {moderationCategories.length > 0 ? (
          <Stack direction="row" customStyle="flex-wrap">
            {moderationCategories.map((category, idx) => (
              <Pill key={category + idx} label={category} active={true} customStyle="mt-3 mr-3" />
            ))}
          </Stack>
        ) : (
          <Text>{noCategoriesLabel}</Text>
        )}
      </Stack>

      <Divider />

      <Stack spacing="gap-y-3">
        <Stack direction="row" align="center" justify="between">
          <Text variant="button-md" weight="bold">
            {contactInfoLabel}
          </Text>

          <Button plain={true} onClick={onButtonClick(EDIT_CONTACT_INFO)}>
            <Text
              variant="button-md"
              weight="bold"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            >
              {changeLabel}
            </Text>
          </Button>
        </Stack>

        <Text variant="footnotes2">{contactInfoIntroLabel}</Text>

        <Stack spacing="gap-y-2">
          {contactInfo.map(({ icon, solid, value }) => (
            <Stack direction="row" key={value} align="center" spacing="gap-x-2">
              <Button
                icon={icon}
                solidIcon={solid}
                variant="primary"
                greyBg={true}
                iconOnly={true}
                size="xs"
              />

              <Text variant="footnotes2">{value}</Text>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider />

      {isAdmin && (
        <>
          <Stack spacing="gap-y-3">
            <Stack direction="row" align="center" justify="between">
              <Text variant="button-md" weight="bold">
                {maxApplicantsLabel}
              </Text>

              <Button plain={true} onClick={onButtonClick(EDIT_MAX_APPLICANTS)}>
                <Text
                  variant="button-md"
                  weight="bold"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                >
                  {changeLabel}
                </Text>
              </Button>
            </Stack>

            <Text variant="footnotes2">{maxApplicantsIntroLabel}</Text>

            <Stack direction="row" spacing="gap-x-3">
              <Text
                variant="button-md"
                weight="bold"
                color={{ light: 'black', dark: 'grey6' }}
              >{`${currentNumberLabel}:`}</Text>
              <Text variant="button-md">{maxApplicants}</Text>
            </Stack>
          </Stack>

          <Divider />
        </>
      )}

      <Stack spacing="gap-y-3">
        <Text variant="button-md" weight="bold">
          {moderationDutiesLabel}
        </Text>
        <Text variant="footnotes2">{moderationDutiesDescLabel}</Text>

        <Button
          size="md"
          label={resignButtonLabel}
          customStyle="self-end mt-3"
          onClick={onButtonClick(RESIGN_ROLE)}
        />
      </Stack>
    </Stack>
  );
};
