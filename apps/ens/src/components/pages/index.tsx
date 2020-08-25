import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { IAppProps } from '../app';
import { getProfileStore } from '../../state/profile-state';
import Routes from './routes';

const { ErrorInfoCard, ErrorLoader } = DS;

export interface IPagesProps extends IAppProps {
  errors: any;
}

const Pages: React.FC<IPagesProps> = props => {
  const { errors, sdkModules, logger, globalChannel } = props;
  const { t } = useTranslation();
  const Profile = getProfileStore(sdkModules, globalChannel, logger);

  return (
    <ErrorInfoCard errors={errors}>
      {(messages, isCritical) => (
        <>
          {messages && (
            <ErrorLoader
              type="script-error"
              title={t('There was an error loading the entry')}
              details={t('We cannot show this entry right now')}
              devDetails={messages}
            />
          )}
          {!isCritical && (
            <Profile.Provider>
              <Routes {...props} />
            </Profile.Provider>
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default Pages;
