import * as React from 'react';
import DS from '@akashaproject/design-system';

const { ResponsiveContext, Grid, Grommet, lightTheme } = DS;

const columns = {
  small: Array(4).fill('1fr'),
  medium: Array(6).fill('1fr'),
  large: Array(9).fill('1fr'),
  xlarge: Array(9).fill('1fr'),
};
const getContentAreas = (columnsNum: number) => {
  return {
    small: [Array(columnsNum).fill('plugin-content')],
    medium: [
      Array(columnsNum - 2)
        .fill('plugin-content')
        .concat(Array(2).fill('widget-list')),
    ],
    large: [
      Array(columnsNum - 3)
        .fill('plugin-content')
        .concat(Array(3).fill('widget-list')),
    ],
    xlarge: [
      Array(columnsNum - 3)
        .fill('plugin-content')
        .concat(Array(3).fill('widget-list')),
    ],
  };
};

const columnGaps = {
  small: '1em',
  medium: '1.5em',
  large: '2em',
  xlarge: '2.5em',
};

interface IPluginGridProps {
  children: (gridConfig: {}) => React.ReactNode;
}

const PluginGrid = (props: IPluginGridProps) => {
  const [size, setSize] = React.useState();
  const context = React.useContext(ResponsiveContext);
  React.useEffect(() => {
    if (context) {
      setSize(context);
    }
  }, [context]);
  const gridConfig = {
    gridAreas: {
      pluginContent: 'plugin-content',
      widgetList: 'widget-list',
    },
    size,
  };
  const columnsVal = columns[size || 'small'];
  const areas = getContentAreas(columnsVal.length);
  return (
    <Grommet theme={lightTheme} style={{ height: '100%' }}>
      <Grid
        fill={true}
        rows={[]}
        columns={columns[size]}
        gap={{
          column: columnGaps[size],
        }}
        areas={areas[size]}
      >
        {props.children(gridConfig)}
      </Grid>
    </Grommet>
  );
};

export default PluginGrid;
