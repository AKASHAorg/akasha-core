import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
// import {
//   InfiniteScroll,
//   InfiniteScrollList,
// } from "@akashaorg/ui/lib/akasha-components/infinite-scroll";
import { useGetAppsQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { selectAkashaApps } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-query';

type WorldConfigFormStep2Props = {
  worldId: string;
};

export const WorldConfigFormStep2Page: React.FC<WorldConfigFormStep2Props> = ({ worldId }) => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();

  const handleSave = () => {
    navigate({ to: '/dashboard' });
  };
  const handleNavBack = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId } });
  };

  const {
    data: getAppsReq,
    loading: loadingGetAppsQuery,
    error: getAppsError,
    fetchMore,
  } = useGetAppsQuery({
    variables: { first: 10 },
  });

  const akashaApps = selectAkashaApp(getAppsReq);

  return (
    <Card>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={2} className="max-w-[112px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Choose Your Extensions')}</Typography>
        </CardTitle>
        <CardDescription className="flex justify-start">
          <Typography variant="h6">{t('World Extensions')}</Typography>
          <Typography variant="sm">
            {t(
              'Add the extensions to be installed in your world. The order you add them here will be reflected in the sidebar.',
            )}
          </Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InfiniteScroll
          count={akashaApps?.length}
          estimatedHeight={60}
          overScan={10}
          itemSpacing={0}
        >
          <InfiniteScrollList>
            {index => {
              appData = akashaApps[index];
              return <></>;
            }}
          </InfiniteScrollList>
        </InfiniteScroll>
      </CardContent>
      <CardFooter>
        <Button className="px-6 h-8" variant="outline" onClick={handleNavBack}>
          {t('Back')}
        </Button>
        <Button className="px-6 h-8" onClick={handleSave}>
          {t('Save Config')}
        </Button>
      </CardFooter>
    </Card>
  );
};
