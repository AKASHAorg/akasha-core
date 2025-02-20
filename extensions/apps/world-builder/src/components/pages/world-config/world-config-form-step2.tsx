import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

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

  return (
    <Card>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={3} className="max-w-[250px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('World Config')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
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
