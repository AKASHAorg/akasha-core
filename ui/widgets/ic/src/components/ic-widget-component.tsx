import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { ICWidgetCard, Box } = DS;

const ICWidgetComponent: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation();

  return (
    <Box pad={{ bottom: 'small' }}>
      {/* {(ICWorldAppsReq.isError || ICInstalledAppsReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('Oops, this widget has an error')}
          details={
            ICWorldAppsReq.isError
              ? t('Cannot load Integration Center apps')
              : t('Cannot load Integration Center widget')
          }
        />
      )} */}
      <ICWidgetCard
        worldApps={[]}
        installedApps={[]}
        titleLabel={t('My Apps')}
        worldAppsLabel={t('World Apps')}
        installedAppsLabel={t('Installed')}
        noWorldAppsLabel={t('No World Apps. Please check later')}
        noInstalledAppsLabel={t('No Installed Apps. Please install an app')}
        icAppsAnchorLink={''}
        onClickWorldApp={() => null}
        onClickInstalledApp={() => null}
        onActiveTabChange={() => null}
      />
    </Box>
  );
};

export default ICWidgetComponent;
