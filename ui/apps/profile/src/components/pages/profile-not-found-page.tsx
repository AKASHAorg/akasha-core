import React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import Default404Image from '@akashaorg/design-system-components/lib/components/Default404Image';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import routes, { EDIT } from '../../routes';

const ProfileNotFoundPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const { t } = useTranslation('app-profile');

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const publicImgPath = '/images';

  const goToHomepage = () => {
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => navRoutes.defaultRoute,
    });
  };

  return (
    <>
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <Card direction="row" elevation={'1'} radius={16} padding={8}>
          <Stack direction="column" customStyle="mb-32">
            <Default404Image url={`${publicImgPath}/new404.webp`} />
            <Text variant={'h6'} align="center">
              {t('This profile doesn’t exist')}
            </Text>
          </Stack>
          <Stack direction="row" customStyle="pr-2 pb-2" justify="end" fullWidth>
            <Button variant="primary" label={t('Go back home')} onClick={goToHomepage} />
          </Stack>
        </Card>
      </Stack>
    </>
  );
};

export default ProfileNotFoundPage;
