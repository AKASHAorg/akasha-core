import { Grid, ResponsiveContext } from '@akashaproject/design-system';
import * as React from 'react';

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
        background: '#EDF0F5',
        overflow: 'hidden',
      }}
      areas={areas[size]}
    >
      <div style={{ gridArea: 'header' }} id={topbarSlotId} />
      <div style={{ gridArea: sidebarProps.gridArea, ...sidebarProps.style }} id={sidebarSlotId} />
      <div
        style={{ gridArea: 'plugin', overflowX: 'hidden', overflowY: 'auto' }}
        id={pluginSlotId}
      />

      {/*<Box gridArea="header" id={topbarSlotId} />*/}
      {/*<Box {...sidebarProps} id={sidebarSlotId} />*/}
      {/*<Box*/}
      {/*  gridArea="plugin"*/}
      {/*  id={pluginSlotId}*/}
      {/*  overflow={{*/}
      {/*    vertical: 'auto',*/}
      {/*    horizontal: 'hidden',*/}
      {/*  }}*/}
      {/*/>*/}
    </Grid>
  );
};

export default ResponsiveGrid;
