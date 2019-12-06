import DS from '@akashaproject/design-system';
import * as React from 'react';

const { Box, Grid, ResponsiveContext } = DS;
// If the size is small, we only see 1 column
// If the size is medium, we only see 2 columns
// If the size is either large or xlarge, we see 3 columns
const columns = {
  small: Array(4).fill('1fr'),
  medium: Array(10).fill('1fr'),
  large: Array(12).fill('1fr'),
  xlarge: Array(12).fill('1fr'),
};
const getContentAreas = (columnsNum: number) => {
  return {
    small: [Array(columnsNum).fill('header'), Array(columnsNum).fill('plugin')],
    medium: [
      Array(columnsNum).fill('header'),
      ['sidebar', 'sidebar'].concat(Array(columnsNum - 2).fill('plugin')),
    ],
    large: [
      Array(columnsNum).fill('header'),
      ['sidebar', 'sidebar'].concat(Array(columnsNum - 2).fill('plugin')),
    ],
    xlarge: [
      Array(columnsNum).fill('header'),
      ['sidebar', 'sidebar'].concat(Array(columnsNum - 2).fill('plugin')),
    ],
  };
};

const columnGaps = {
  small: '1em',
  medium: '1.5em',
  large: '2em',
  xlarge: '2.5em',
};

interface IResponsiveGridSystem {
  sidebarSlotId: string;
  topbarSlotId: string;
  pluginSlotId: string;
}

const ResponsiveGrid = (props: IResponsiveGridSystem) => {
  const { sidebarSlotId, topbarSlotId, pluginSlotId } = props;
  const [size, setSize] = React.useState();

  const context = React.useContext(ResponsiveContext);

  React.useEffect(() => {
    if (context) {
      setSize(context);
    }
  }, [context]);

  const columnsVal = columns[size || 'small'];
  const areas = getContentAreas(columnsVal.length);
  let sidebarProps: { gridArea?: string; style?: {} } = { gridArea: 'sidebar' };
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
      fill={true}
      rows={['72px', '1fr']}
      columns={columns[size]}
      gap={{
        row: '2em',
        column: columnGaps[size],
      }}
      style={{
        background: '#FBFCFD',
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
};

export default ResponsiveGrid;
