import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@akashaorg/ui/lib/components/Card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

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
        <Stepper currentStep={1} numberOfSteps={3} />
        <CardTitle className="text-center">
          <Typography variant="h5">{t('World Default Apps')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="justify-end">
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
