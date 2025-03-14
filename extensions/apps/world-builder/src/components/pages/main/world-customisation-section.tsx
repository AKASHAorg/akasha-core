import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Loader2, Pencil, Link } from 'lucide-react';
import { useGetWorldMetaInfoQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { selectWorldMetaInfoData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-meta-info-query';
import { Github } from '@akashaorg/ui/lib/custom-icons/github';
import { Telegram } from '@akashaorg/ui/lib/custom-icons/telegram';
import { Discord } from '@akashaorg/ui/lib/custom-icons/discord';
import { X } from '@akashaorg/ui/lib/custom-icons/x';

type WorldCustomisationSectionProps = {
  worldId: string;
  worldCreatorId: string;
};

export const iconsMap = {
  github: <Github />,
  telegram: <Telegram />,
  discord: <Discord />,
  twitter: <X />,
  other: <Link />,
};

export const WorldCustomisationSection: React.FC<WorldCustomisationSectionProps> = ({
  worldId,
  worldCreatorId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const {
    data: worldMetaInfoReq,
    loading: loadingWorldMetaInfoQuery,
    error: worldMetaInfoError,
  } = useGetWorldMetaInfoQuery({
    variables: { worldID: worldId, creator: worldCreatorId },
    skip: !worldId,
  });

  const worldMetaInfo = selectWorldMetaInfoData(worldMetaInfoReq);

  const handleNavToCustomiseForm = () => {
    navigate({ to: '/world-customise-form/$worldId', params: { worldId: worldId } });
  };

  if (worldMetaInfoError) {
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>
          {t('Sorry, there was an error when fetching the world meta info data')}
        </ErrorLoaderTitle>
        <ErrorLoaderDescription>{worldMetaInfoError?.message}</ErrorLoaderDescription>
      </ErrorLoader>
    );
  }

  return (
    <Stack direction="column" spacing={4}>
      {loadingWorldMetaInfoQuery && <Loader2 className="animate-spin" />}
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Typography variant="h6">{t('World Customisation')}</Typography>
        {worldMetaInfo?.id ? (
          <Button variant="secondary" size="icon" onClick={handleNavToCustomiseForm}>
            <Pencil />
          </Button>
        ) : (
          <Button onClick={handleNavToCustomiseForm}>{t('Customise World')}</Button>
        )}
      </Stack>
      {!worldMetaInfo?.id && (
        <Typography variant="sm">
          {t('You haven’t customized your world configuration yet!')}
        </Typography>
      )}
      {worldMetaInfo?.id && (
        <>
          <Stack direction="column" spacing={2}>
            <Typography variant="sm" bold>
              {t('World Description')}
            </Typography>
            <Typography variant="sm">
              {worldMetaInfo?.description ?? t('You haven’t added any description yet.')}
            </Typography>
          </Stack>
          <Stack direction="column" spacing={2}>
            <Typography variant="sm" bold>
              {t('Keywords')}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {worldMetaInfo?.keywords?.length > 0 ? (
                worldMetaInfo?.keywords?.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary">
                    {keyword}
                  </Badge>
                ))
              ) : (
                <Typography variant="sm">{t('You haven’t added any keywords yet.')}</Typography>
              )}
            </div>
          </Stack>
          <Stack direction="column" alignItems="start" spacing={2}>
            <Typography variant="sm" bold>
              {t('Guidelines URL')}
            </Typography>
            {worldMetaInfo?.guidelinesUrl ? (
              <Button variant="link" className="p-0" asChild>
                <a rel="noreferrer" target="__blank" href={worldMetaInfo?.guidelinesUrl}>
                  {worldMetaInfo?.guidelinesUrl}
                </a>
              </Button>
            ) : (
              <Typography variant="sm">{t('You haven’t added the guidelines URL yet.')}</Typography>
            )}
          </Stack>
          <Stack direction="column" spacing={2}>
            <Typography variant="sm" bold>
              {t('Socials')}
            </Typography>
            <Stack direction="column" alignItems="start" spacing={2}>
              {worldMetaInfo?.socialLinks?.length > 0 ? (
                worldMetaInfo?.socialLinks?.map((link, idx) => (
                  <Button key={idx} variant="link" className="p-0" asChild>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {iconsMap[link?.name]}
                      <a rel="noreferrer" target="__blank" href={link?.href}>
                        {link?.href}
                      </a>
                    </Stack>
                  </Button>
                ))
              ) : (
                <Typography variant="sm">{t('You haven’t added any social links yet.')}</Typography>
              )}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
