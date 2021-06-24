import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useErrors, useLegal } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps, LEGAL_DOCS } from '@akashaproject/ui-awf-typings';

const { ErrorInfoCard, ErrorLoader, MdCard } = DS;

const DeveloperGuidelinesPage = (props: RootComponentProps) => {
  const { logger } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrors({ logger });
  const [legalDocsState, legalDocsActions] = useLegal({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    legalDocsActions.getLegalDoc(LEGAL_DOCS.APP_GUIDE);
  }, []);
  return (
    <>
      <ErrorInfoCard errors={errorState}>
        {(messages, hasCritical) => (
          <>
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('There was an error loading the docs')}
                details={messages}
              />
            )}
            {!hasCritical && <MdCard mdText={legalDocsState} />}
          </>
        )}
      </ErrorInfoCard>
    </>
  );
};

export default DeveloperGuidelinesPage;
