import React from 'react';

import { IconType } from '@akashaorg/typings/ui';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { EDIT_CATEGORIES, EDIT_CONTACT_INFO, RESIGN_ROLE } from '../../routes';

export interface IModeratorDashboardProps {
  tabLabels: string[];
  moderatorSinceLabel: string;
  moderationCategoriesLabel: string;
  moderationCategories: string[];
  contactInfoLabel: string;
  contactInfo: { type: IconType; value: string }[];
  moderationDutiesLabel: string;
  moderationDutiesDescLabel: string;
  changeLabel: string;
  resignButtonLabel: string;
  onButtonClick: (route: string) => () => void;
}

const ModeratorDashboard: React.FC<IModeratorDashboardProps> = props => {
  const {
    tabLabels,
    moderatorSinceLabel,
    moderationCategoriesLabel,
    moderationCategories,
    contactInfoLabel,
    contactInfo,
    moderationDutiesLabel,
    moderationDutiesDescLabel,
    changeLabel,
    resignButtonLabel,
    onButtonClick,
  } = props;

  const wrapperStyle = 'p-4 space-y-4';

  return (
    <BasicCardBox pad="p-0 pt-4">
      <Tab labels={tabLabels} labelTextVariant="body1">
        {/* General tab */}
        <Box customStyle={wrapperStyle}>
          <Box customStyle="flex items-center justify-between">
            <Text weight="bold">{moderatorSinceLabel}</Text>
            <Text color="grey4">01-Jan-2020</Text>
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
            <Box customStyle="flex flex-wrap">
              {moderationCategories.map((category, idx) => (
                <Pill
                  key={category + idx}
                  label={category}
                  secondaryBg={true}
                  customStyle="mt-3 mr-3"
                />
              ))}
            </Box>
          </Box>

          <Divider />

          <Box customStyle="flex flex-col">
            <Box customStyle="flex items-center justify-between mb-3">
              <Text weight="bold">{contactInfoLabel}</Text>

              <Button plain={true} onClick={onButtonClick(EDIT_CONTACT_INFO)}>
                <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                  {changeLabel}
                </Text>
              </Button>
            </Box>

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

        {/* Activity tab */}
        <Box customStyle={wrapperStyle}>
          <Text>Activities will appear here ...</Text>
        </Box>
      </Tab>
    </BasicCardBox>
  );
};

export default ModeratorDashboard;
