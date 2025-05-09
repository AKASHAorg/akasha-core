import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Moderator } from '@akashaorg/typings/lib/ui';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { Tabs, TabsList, TabsTrigger } from '@akashaorg/ui/lib/components/tabs';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ModeratorDetailMiniCard from '../components/moderator/mini-card';
import { generateModeratorStatusLabel } from '../utils';
import { BasePageProps } from './overview';

export type ModeratorPageProps = BasePageProps & {
  isFetchingModerators: boolean;
  moderators: Moderator[];
};

export const Moderators: React.FC<ModeratorPageProps> = props => {
  const { moderators, isFetchingModerators } = props;
  const [activeTab, setActiveTab] = useState<string>('0');
  const { t } = useTranslation('app-vibes');
  const navigate = useNavigate();

  const tabs = ['Active', 'Resigned', 'Dismissed'];

  const filteredModeratorsList = moderators?.filter(
    moderator => moderator.status === tabs[activeTab].toLowerCase(),
  );

  const handleViewModerator = (profileId: string) => {
    navigate({
      to: '/moderators/$moderatorId',
      params: {
        moderatorId: profileId,
      },
    });
  };

  return (
    <Card className="p-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full m-4">
        <TabsList className="px-4 justify-between w-[95%]">
          {tabs.map((item, index) => (
            <TabsTrigger key={item} value={`${index}`} className="grow">
              {t('{{item}}', { item })}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isFetchingModerators && (
        <Stack align="center" justify="center" customStyle="p-4">
          <Spinner size="lg" />
        </Stack>
      )}

      {!isFetchingModerators && filteredModeratorsList.length === 0 && (
        <Text align="center" customStyle="pb-4">
          {t('No moderators found...yet')}
        </Text>
      )}

      {!isFetchingModerators && filteredModeratorsList && filteredModeratorsList.length > 0 && (
        <Stack>
          <Stack fullWidth={true} customStyle="h-full overflow-y-scroll">
            {filteredModeratorsList?.map((moderator, idx) => {
              const tenureInfoLabel = generateModeratorStatusLabel(moderator.status);

              return (
                <ModeratorDetailMiniCard
                  key={moderator.did.id + moderator.name}
                  moderator={moderator}
                  hasBorderBottom={idx < filteredModeratorsList.length - 1}
                  moderatedItemsLabel={t('items')}
                  tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
                  onCardClick={handleViewModerator}
                />
              );
            })}
          </Stack>
        </Stack>
      )}
    </Card>
  );
};
