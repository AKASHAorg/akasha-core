import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import { DeveloperMode } from '../developer-mode';
import { DEV_MODE_KEY } from '../../constants';
import routes, { MY_EXTENSIONS } from '../../routes';

export enum DevMode {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export const DeveloperModePage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  // get the dev mode preference, if any, from local storage
  const localValue = window.localStorage.getItem(DEV_MODE_KEY);

  const [devMode, setDevMode] = useState<string>(localValue);

  const handleToggleDevMode = () => {
    const value = devMode === DevMode.ENABLED ? DevMode.DISABLED : DevMode.ENABLED;
    setDevMode(value);
    window.localStorage.setItem(DEV_MODE_KEY, value);

    // allow one sec delay, then reload the page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCTAClick = () => {
    navigate({
      to: routes[MY_EXTENSIONS],
    });
  };

  return (
    <DeveloperMode
      titleLabel={t('Developer Mode')}
      sections={[
        {
          title: t('Extensions Developer Mode'),
          toggleButtonNode: (
            <Toggle checked={devMode === DevMode.ENABLED} onChange={handleToggleDevMode} />
          ),
          descriptionNode: (
            <Text as="span" color={{ light: 'grey4', dark: 'grey6' }}>
              {`🌟 ${t("When you enable Dev Mode, you'll unlock the ability to create awesome extensions in the Extensions app! 🚀 Once enabled, a new sub menu item called")} `}
              <Text as="span" weight="bold">
                {`"${t('My Extensions')}"`}
              </Text>
              {` ${t('will appear on the sidebar')}. 💻✨`}
            </Text>
          ),
          ...(devMode === DevMode.ENABLED && {
            ctaNode: (
              <Button
                size="md"
                variant="text"
                label={t('Go to My Extensions')}
                customStyle="w-fit self-end"
                onClick={handleCTAClick}
              />
            ),
          }),
        },
        {
          title: t('AKASHA World Developer Guide'),
          descriptionNode: (
            <Text color={{ light: 'grey4', dark: 'grey6' }}>
              {`🌐 ${t('Become a developer in AKASHA World, create your first extension, and join our vibrant developer community! ')}🌐`}
            </Text>
          ),
          ctaNode: (
            <Link target="_blank" to="https://docs.akasha.world" customStyle="w-fit self-end">
              <Button size="md" variant="text" label={t('Read AW Developer Guide ')} />
            </Link>
          ),
        },
      ]}
    />
  );
};
