import React, { PureComponent, Suspense } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import EntryFeed from './entry-feed';
import ProfileFeed from './profile-feed';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export const enum ItemTypes {
  ENTRY = 0,
  PROFILE,
  COMMENT,
}

export interface IFeedWidgetProps {
  logger: any;
  i18n: any;
  globalChannel?: any;
  sdkModules: any;
  layout: any;
  listHeader?: React.ReactElement;
  itemType: ItemTypes;
  loadMore: (payload: any) => void;
  loadItemData?: ({ itemId }: { itemId: string }) => void;
  itemIds: string[];
  itemsData: { [key: string]: any };
  errors: { [key: string]: IAkashaError };
}

export default class FeedWidgetRoot extends PureComponent<IFeedWidgetProps> {
  public state: { errors: any } = {
    errors: this.props.errors,
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('feed-widget error %j %j', error, errorInfo);
    }
    this.setState({
      errors: {
        'feedWidget.app': {
          error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
          critical: false,
        },
      },
    });
  }

  public render() {
    console.log(this.props.errors, this.state.errors, 'errors in App.tsx');
    return (
      <I18nextProvider i18n={this.props.i18n}>
        <Suspense fallback={<></>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            {this.props.itemType === ItemTypes.ENTRY && (
              <EntryFeed {...this.props} errors={{ ...this.state.errors, ...this.props.errors }} />
            )}
            {this.props.itemType === ItemTypes.PROFILE && (
              <ProfileFeed
                {...this.props}
                errors={{ ...this.state.errors, ...this.props.errors }}
              />
            )}
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}
