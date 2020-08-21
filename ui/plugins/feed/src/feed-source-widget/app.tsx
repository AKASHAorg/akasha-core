import * as React from 'react';
import DS from '@akashaproject/design-system';
import type { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { SourcesWidgetCard, ThemeSelector, lightTheme, darkTheme } = DS;

export default class FeedSourceWidget extends React.Component<RootComponentProps> {
  public handleSeeAllClick = () => {
    // todo
  };
  render() {
    return (
      <ThemeSelector
        settings={{ activeTheme: 'Light-Theme' }}
        availableThemes={[lightTheme, darkTheme]}
        style={{ height: '100%' }}
        plain={true}
      >
        <SourcesWidgetCard
          titleLabel={'My feed sources'}
          tagsNumber={15}
          profilesNumber={35}
          appsNumber={50}
        />
      </ThemeSelector>
    );
  }
}
