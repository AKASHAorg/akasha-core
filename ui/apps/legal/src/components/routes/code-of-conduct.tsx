import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { useLegalDoc } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps, LEGAL_DOCS } from '@akashaorg/typings/ui';

const { ErrorInfoCard, ErrorLoader, MdCard } = DS;

const CodeOfConductPage = (_props: RootComponentProps) => {
  const { t } = useTranslation('app-legal');

  const legalDocReq = useLegalDoc(LEGAL_DOCS.CODE_OF_CONDUCT);
  const legalDoc = legalDocReq.data;
  const error = legalDocReq.error as Error | null;

  return (
    <>
      <ErrorInfoCard error={error}>
        {message => (
          <>
            {message && (
              <ErrorLoader
                type="script-error"
                title={t('There was an error loading the docs')}
                details={message}
              />
            )}
            {!message && <MdCard mdText={legalDoc} />}
          </>
        )}
      </ErrorInfoCard>
    </>
  );
};

export default CodeOfConductPage;
