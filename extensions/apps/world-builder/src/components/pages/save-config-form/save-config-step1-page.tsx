import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@akashaorg/ui/lib/components/Card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

export const SaveConfigStep1Page: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const handleNavigateToStep2 = () => {
    navigate({ to: '/save-config/step2' });
  };
  const handleCancel = () => {
    navigate({ to: '/home' });
  };

  return (
    <>
      <CardHeader>
        <Stepper currentStep={1} numberOfSteps={3} />
        <CardTitle className="text-center">
          <Typography variant="h5">{t('World Config')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="justify-end">
        <Button className="px-6 h-8" variant="outline" onClick={handleCancel}>
          {t('Cancel')}
        </Button>
        <Button className="px-6 h-8" onClick={handleNavigateToStep2}>
          {t('Next')}
        </Button>
      </CardFooter>
    </>
  );
};
