import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';

const { LoginCTAWidgetCard } = DS;

export interface ILoginWidgetProps {
  sdkModules: any;
  logger: any;
  globalChannel?: any;
  layoutConfig: {
    modalSlotId: string;
  };
}

const LoginWidget: React.FC<ILoginWidgetProps> = () => {
  const { t } = useTranslation();

  return (
    <>
      <LoginCTAWidgetCard
        title={`🚀 ${t(' Welcome to Ethereum World!')}`}
        subtitle={t('We are in private alpha at this time. ')}
        beforeLinkLabel={t("If you'd like to participate,")}
        afterLinkLabel={t("and we'll add you to our waitlist!")}
        writeToUsLabel={t('write to us')}
        writeToUsUrl={'mailto://hello@ethereum.world'}
      />
    </>
  );
};

export default LoginWidget;
