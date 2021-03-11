import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import EntryFeed from './entry-feed';
import ProfileFeed from './profile-feed';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { i18n } from 'i18next';
import { IContentClickDetails } from '@akashaproject/design-system/src/components/Cards/entry-cards/entry-box';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export const enum ItemTypes {
  ENTRY = 0,
  PROFILE,
  COMMENT,
  TAG,
}

export interface IFeedWidgetProps {
  logger: any;
  i18n: i18n;
  virtualListRef: any;
  globalChannel?: any;
  sdkModules: any;
  layout: any;
  listHeader?: React.ReactElement;
  itemType: ItemTypes;
  loadMore: (payload: any) => void;
  loadItemData?: ({ itemId }: { itemId: string }) => void;
  getShareUrl?: (entryId: string) => string;
  itemIds: string[];
  itemsData: { [key: string]: any };
  errors: { [key: string]: IAkashaError };
  /* eth address of the logged in user */
  ethAddress: string | null;
  profilePubKey: string | null;
  onNavigate: (itemType: ItemTypes, details: IContentClickDetails) => void;
  onLoginModalOpen: () => void;
  isFetching?: boolean;
  totalItems: number | null;
  modalSlotId?: string;
  loggedProfile?: any;
  onRepostPublish?: (entryData: any, embeddedEntry: any) => void;
  contentClickable?: boolean;
  onReport: (entryId: string, user?: string | null) => void;
  handleFlipCard?: (entry: any, isQuote: boolean) => () => void;
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
  componentDidMount() {
    if (this.props.i18n) {
      this.props.i18n.loadNamespaces('ui-widget-feed');
    }
  }
  public render() {
    return (
      <React.Suspense fallback={<></>}>
        <I18nextProvider i18n={this.props.i18n} defaultNS="ui-widget-feed">
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
        </I18nextProvider>
      </React.Suspense>
    );
  }
}
