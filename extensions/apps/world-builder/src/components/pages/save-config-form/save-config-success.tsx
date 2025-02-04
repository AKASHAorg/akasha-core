import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@akashaorg/ui/lib/components/Card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

export const SaveConfigSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const handleOpenPreview = () => {
    navigate({ to: '/save-config/success' });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">
          <Typography variant="h5">{t(`Nana World was configured successfully!`)}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardDescription className="text-center">
        <Typography variant="h5">
          {t(`You can now preview this world! The preview will open in a new tab`)}
        </Typography>
      </CardDescription>
      <CardFooter className="justify-center">
        <Button className="px-6 h-8" onClick={handleOpenPreview}>
          {t('Preview World')}
        </Button>
      </CardFooter>
    </>
  );
};
