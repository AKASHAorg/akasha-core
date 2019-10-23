// @ts-ignore
import { Box, Grid, Grommet, grommet, ResponsiveContext } from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';

export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
  sidebarSlotId: string;
  topbarSlotId: string;
  pluginSlotId: string;
}

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
// If the size is small, we only see 1 column
// If the size is medium, we only see 2 columns
// If the size is either large or xlarge, we see 3 columns
const columns = {
  small: new Array(4).fill('1fr'),
  medium: new Array(8).fill('1fr'),
  large: new Array(12).fill('1fr'),
  xlarge: new Array(12).fill('1fr'),
};
const getContentAreas = (columnsNum: number) => {
  return {
    small: [new Array(columnsNum).fill('header'), new Array(columnsNum).fill('plugin')],
    medium: [
      new Array(columnsNum).fill('header'),
      ['sidebar', 'sidebar'].concat(new Array(columnsNum - 2).fill('plugin')),
    ],
    large: [
      new Array(columnsNum).fill('header'),
      ['sidebar', 'sidebar'].concat(new Array(columnsNum - 2).fill('plugin')),
    ],
    xlarge: [
      new Array(columnsNum).fill('header'),
      ['sidebar', 'sidebar'].concat(new Array(columnsNum - 2).fill('plugin')),
    ],
  };
};

const columnGaps = {
  small: '1em',
  medium: '1.5em',
  large: '2em',
  xlarge: '2.5em',
};

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
        <ResponsiveContext.Consumer>
          {size => {
            let columnsVal;
            if (columns) {
              if (columns[size]) {
                columnsVal = columns[size];
              }
            }

            const areas = getContentAreas(columnsVal.length);
            let sidebarProps = {
              gridArea: 'sidebar',
            } as { gridArea?: string; style?: {} };
            if (['small'].includes(size)) {
              sidebarProps = {
                style: {
                  display: 'none',
                  position: 'fixed',
                  left: 0,
                  right: 0,
                  top: '72px',
                  bottom: 0,
                  width: '250px',
                },
              };
            }

            return (
              <Grid
                fill
                rows={['72px', '1fr']}
                columns={columnsVal}
                gap={{
                  row: '2em',
                  column: columnGaps[size],
                }}
                style={{
                  background: '#EDF0F5',
                  overflow: 'hidden',
                }}
                areas={areas[size]}
              >
                <Box gridArea="header" id={topbarSlotId} />
                <Box {...sidebarProps} id={sidebarSlotId} />
                <Box
                  gridArea="plugin"
                  id={pluginSlotId}
                  overflow={{
                    vertical: 'auto',
                    horizontal: 'hidden',
                  }}
                />
              </Grid>
            );
          }}
        </ResponsiveContext.Consumer>
      </Grommet>
    );
  }
}
