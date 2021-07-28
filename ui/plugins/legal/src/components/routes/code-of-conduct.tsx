import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useErrors } from '@akashaproject/ui-awf-hooks';
import { useLegalDoc } from '@akashaproject/ui-awf-hooks/lib/use-legal.new';
import { RootComponentProps, LEGAL_DOCS } from '@akashaproject/ui-awf-typings';

const { ErrorInfoCard, ErrorLoader, MdCard } = DS;

const CodeOfConductPage = (props: RootComponentProps) => {
  const { logger } = props;

  const { t } = useTranslation();

  const [errorState] = useErrors({ logger });

  const legalDocReq = useLegalDoc(LEGAL_DOCS.CODE_OF_CONDUCT);
  const legalDoc = legalDocReq.data;

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
            {!hasCritical && <MdCard mdText={legalDoc} />}
          </>
        )}
      </ErrorInfoCard>
    </>
  );
};

export default CodeOfConductPage;
