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

type CreateSuccessPageProps = {
  worldId: string;
  worldName: string;
};

export const CreateSuccessPage: React.FC<CreateSuccessPageProps> = ({ worldId, worldName }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const handleNavToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  const handleNavToConfigureWorldForm = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId } });
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle className="text-center">
          <Typography variant="h5">
            {t(`{{worldName}} was created successfully!`, { worldName })}
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="justify-center">
        <ImageRoot className="flex justify-center">
          <Image
            showLoadingIndicator={true}
            src="/images/worldsuccess.webp"
            width={150}
            height={200}
          />
        </ImageRoot>
      </CardContent>
      <CardDescription className="px-6 pb-6 text-center">
        <Typography variant="p">{t(`You’re almost there!`)}</Typography>
        <Typography variant="p">
          {t(
            `🌍 Complete your World’s configuration! A little flavor goes a long way in bringing your World to life! 🚀🔥`,
          )}
        </Typography>
      </CardDescription>
      <CardFooter>
        <Button className="px-6" onClick={handleNavToDashboard}>
          {t('Do it later')}
        </Button>
        <Button className="px-6" onClick={handleNavToConfigureWorldForm}>
          {t('Configure World')}
        </Button>
      </CardFooter>
    </Card>
  );
};
