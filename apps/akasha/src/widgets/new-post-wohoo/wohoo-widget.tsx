import * as React from 'react';
import DS from '@akashaproject/design-system';

const { MiniInfoWidgetCard } = DS;

const WohooWidget: React.FC<{}> = () => {
  return (
    <MiniInfoWidgetCard
      titleLabel={'🚀🙌 Wohoo!'}
      subtitleLabel={
        <>
          You are about to publish on the distributed web! Click <a href="/learnmore">here</a> to
          learn more.
        </>
      }
      handleDismiss={() => {
        /* todo */
      }}
    />
  );
};

export default WohooWidget;
