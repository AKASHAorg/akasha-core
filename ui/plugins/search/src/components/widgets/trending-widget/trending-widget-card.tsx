import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TrendingWidgetRoot from '@akashaproject/ui-widget-trending/lib/components/App';

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { globalChannel, sdkModules, logger, singleSpa, rxjsOperators, i18n, layout } = props;

  return (
    <TrendingWidgetRoot
      layout={layout}
      i18n={i18n}
      globalChannel={globalChannel}
      sdkModules={sdkModules}
      logger={logger}
      singleSpa={singleSpa}
      rxjsOperators={rxjsOperators}
    />
  );
};

export default TrendingWidget;
