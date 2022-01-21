import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useLegalDoc } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps, LEGAL_DOCS } from '@akashaproject/ui-awf-typings';

const { ErrorInfoCard, ErrorLoader, MdCard } = DS;

const PrivacyPolicyPage = (_props: RootComponentProps) => {
  const { t } = useTranslation();

  const legalDocReq = useLegalDoc(LEGAL_DOCS.PRIVACY_POLICY);
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

export default PrivacyPolicyPage;
