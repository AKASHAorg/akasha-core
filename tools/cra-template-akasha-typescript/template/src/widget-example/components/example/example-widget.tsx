import React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';

export const ExampleWidget: React.FC<RootComponentProps> = (props: RootComponentProps) => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <div>Example Widget</div>
    </I18nextProvider>
  );
};
