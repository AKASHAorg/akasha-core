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
  Card,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Image, ImageRoot } from '@akashaorg/ui/lib/akasha-components/image';

type ConfigSuccessPageProps = {
  worldId: string;
  worldName: string;
};

export const ConfigSuccessPage: React.FC<ConfigSuccessPageProps> = ({ worldId, worldName }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const handleNavToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  // TODO: add after preview is available
  const handleOpenPreview = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle className="text-center">
          <Typography variant="h5">
            {t(`{{worldName}} was configured successfully!`, { worldName })}
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="justify-center">
        <ImageRoot className="flex justify-center">
          <Image
            showLoadingIndicator={true}
            src="/images/vibe-report.webp"
            width={150}
            height={200}
          />
        </ImageRoot>
      </CardContent>
      <CardDescription className="px-6 pb-6 text-center">
        <Typography variant="p">{t(`You can now preview this world!`)}</Typography>
        <Typography variant="p">{t(`The preview will open in a new tab`)}</Typography>
      </CardDescription>
      <CardFooter>
        <Button className="px-6" onClick={handleNavToDashboard}>
          {t('Do it later')}
        </Button>
        <Button className="px-6" onClick={handleOpenPreview}>
          {t('Preview World')}
        </Button>
      </CardFooter>
    </Card>
  );
};
