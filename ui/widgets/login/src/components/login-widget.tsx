import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import WidgetErrorCard from './widget-error-card';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export interface ILoginWidgetProps {
  logger: any;
}

export default class LoginWidget extends PureComponent<ILoginWidgetProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error(error, errorInfo);
    }
    this.setState({
      errors: {
        'caught.critical': {
          error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
          critical: true,
        },
      },
    });
  }
  public render() {
    return (
      <ThemeSelector
        settings={{ activeTheme: 'Light-Theme' }}
        availableThemes={[lightTheme, darkTheme]}
        style={{ height: '100%' }}
        plain={true}
      >
        <WidgetErrorCard errors={this.state.errors}>
          <div>Please Login here...</div>
        </WidgetErrorCard>
      </ThemeSelector>
    );
  }
}
