import { Grommet } from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';
import ResponsiveGrid from './responsive-grid';

const breakpoints = {
  global: {
    breakpoints: {
      small: {
        value: 550,
      },
      medium: {
        value: 1024,
      },
      large: {
        value: 1224,
      },
      xlarge: {
        value: 1920,
      },
    },
  },
};
export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
  sidebarSlotId: string;
  topbarSlotId: string;
  pluginSlotId: string;
}

export default class LayoutWidget extends PureComponent<IProps> {
  public state: { hasErrors: boolean; errorMessage: string };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    // tslint:disable-next-line:no-console
    console.error(err, info);
  }

  public render() {
    const { sidebarSlotId, topbarSlotId, pluginSlotId } = this.props;
    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in layout-widget
          <div>
            <code>{this.state.errorMessage}</code>
          </div>
        </div>
      );
    }

    return (
      <Grommet theme={breakpoints} plain full cssVars>
        <ResponsiveGrid
          sidebarSlotId={sidebarSlotId}
          topbarSlotId={topbarSlotId}
          pluginSlotId={pluginSlotId}
        />
      </Grommet>
    );
  }
}
