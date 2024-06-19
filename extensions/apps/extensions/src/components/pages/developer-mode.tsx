import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import { DeveloperMode } from '../developer-mode';
import { DEV_MODE_KEY } from '../../constants';

export enum DevMode {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export const DeveloperModePage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');
  // get the dev mode preference, if any, from local storage
  const localValue = window.localStorage.getItem(DEV_MODE_KEY);

  const [devMode, setDevMode] = useState<string>(localValue);

  const handleToggleDevMode = () => {
    const value = devMode === DevMode.ENABLED ? DevMode.DISABLED : DevMode.ENABLED;
    setDevMode(value);
    window.localStorage.setItem(DEV_MODE_KEY, value);
  };

  return (
    <DeveloperMode
      titleLabel={t('Developer Mode')}
      sections={[
        {
          title: t('Extensions Developer Mode'),
          descriptionNode: (
            <Text as="span" color={{ light: 'grey4', dark: 'grey6' }}>
              {`🌟 ${t("When you enable Dev Mode, you'll unlock the ability to create awesome extensions in the Extensions app! 🚀 Once enabled, a new submenu item called")} `}
              <Text as="span" weight="bold">
                {`"${t('My Extensions')}"`}
              </Text>
              {` ${t('will appear under the Extensions app')}. 💻✨`}
            </Text>
          ),
          toggleButtonNode: (
            <Toggle checked={devMode === DevMode.ENABLED} onChange={handleToggleDevMode} />
          ),
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
