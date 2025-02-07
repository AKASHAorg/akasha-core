import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

export const SaveConfigStep2Page: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const handleNavigateToStep3 = () => {
    navigate({ to: '/save-config/step3' });
  };
  const handleNavigateBack = () => {
    navigate({ to: '/save-config/step1' });
  };

  return (
    <>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={2} numberOfSteps={3} className="max-w-[250px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('World Default Apps')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Button className="px-6 h-8" variant="outline" onClick={handleNavigateBack}>
          {t('Cancel')}
        </Button>
        <Button className="px-6 h-8" onClick={handleNavigateToStep3}>
          {t('Next')}
        </Button>
      </CardFooter>
    </>
  );
};
