import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';

import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { Checkbox } from '@akashaorg/ui/lib/components/checkbox';

const TERMS_OF_USE = '/@akashaorg/app-legal/terms-of-use';

export const LandingPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const handleNavigateToForm = () => {
    navigate({ to: '/world-create-form' });
  };

  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const handleCheckTerms = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <div className="flex justify-center">
          <Image
            showLoadingIndicator={true}
            src="/images/worldbuilder.webp"
            width={150}
            height={200}
          />
        </div>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Build a World 🌍')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardDescription className="px-6 pb-6 text-left">
        <Typography variant="xs">
          {t(
            'Build a community world around your shared interests! It comes with default extensions, and you can pick from a variety of installable ones. 🎯 Everything you choose will be accessible to all members of this world. 🚀',
          )}
        </Typography>
      </CardDescription>
      <CardContent className="justify-start">
        <div className="items-top flex space-x-2">
          <Checkbox id="terms1" checked={acceptedTerms} onCheckedChange={handleCheckTerms} />
          <div className="flex gap-1.5 leading-none">
            <Trans
              defaults={`
              <txt>I agree with the AKASHA CORE <lnk>terms & conditions</lnk> of building a new world.</txt>
              
            `}
              components={{
                txt: <Typography variant="xs" />,
                lnk: (
                  <a
                    href={TERMS_OF_USE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    <Button variant="link" />
                  </a>
                ),
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="px-6 h-8" onClick={handleNavigateToForm} disabled={!acceptedTerms}>
          {t('Next')}
        </Button>
      </CardFooter>
    </Card>
  );
};
