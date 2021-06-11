import * as React from 'react';
import { AxisLeft } from '@vx/axis';
import { Group } from '@vx/group';
import { GridRows } from '@vx/grid';
import { curveCardinal } from '@vx/curve';
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, Bar } from '@vx/shape';
import { extent, max, bisector } from 'd3-array';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import useSimpleClickAway from '../../utils/simpleClickAway';
import { IMentionData } from '../AreaChart';

export interface ILineChart {
  data: IMentionData[];
  width: number;
  height: number;
  margin: { top: number; bottom: number; left: number; right: number };
}

const LineChart: React.FC<ILineChart> = props => {
  const { data, width, height, margin } = props;

  const xMax = width - margin?.left - margin?.right;
  const yMax = height - margin?.top - margin?.bottom;

  const tooltipWrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const tooltipStyles = {
    ...defaultStyles,
    background: '#132540',
    border: '1px solid #132540',
    color: 'white',
  };

  const axisLeftTickLabelProps = {
    dy: '0.25rem',
    fontFamily: 'Arial',
    fontSize: 10,
    textAnchor: 'end' as const,
    fill: '#B6BFD1',
  };

  const bisectDate = bisector<IMentionData, Date>(d => new Date(d.date)).left;

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip();

  useSimpleClickAway(tooltipWrapperRef, () => hideTooltip());

  // define accessor functions
  const getX = (d: IMentionData) => new Date(d.date);
  const getY = (d: IMentionData) => d.mentions;

  // define scales
  const xScale = React.useMemo(
    () => scaleTime({ range: [0, xMax], domain: extent(data, getX) as any }),
    [xMax],
  );

  const yScale = React.useMemo(
    () => scaleLinear({ range: [yMax, 0], domain: [0, max(data, getY)] as any, nice: true }),
    [yMax],
  );

  const handleTooltip = React.useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getX(d1)) {
        d = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(getX(d)),
        tooltipTop: yScale(getY(d)),
      });
    },
    [showTooltip, yScale, xScale],
  );

  const chart = (
    <svg width={width} height={height} ref={svgRef}>
      <Group top={margin.top} left={margin.left}>
        <GridRows
          scale={yScale}
          width={xMax}
          strokeDasharray="3,3"
          stroke={'#EDF0F5'}
          strokeOpacity={0.8}
          pointerEvents="none"
          numTicks={4}
        />

        <LinePath
          curve={curveCardinal}
          data={data}
          x={d => xScale(getX(d)) || 0}
          y={d => yScale(getY(d)) || 0}
          stroke={'#4E71FF'}
          strokeWidth={1}
          pointerEvents="none"
        />
        <AxisLeft
          scale={yScale}
          numTicks={4}
          stroke={'transparent'}
          tickStroke={'transparent'}
          tickLabelProps={() => axisLeftTickLabelProps}
          rangePadding={40}
        />
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={3}
              strokeWidth={1}
              stroke={'#4E71FF'}
              fill={'#4E71FF'}
              pointerEvents="none"
            />
          </g>
        )}
      </Group>
    </svg>
  );

  return (
    <div style={{ position: 'relative' }}>
      {chart}
      {tooltipData && (
        <div ref={tooltipWrapperRef}>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            {`${getY(tooltipData as IMentionData)} mentions`}
          </TooltipWithBounds>
        </div>
      )}
    </div>
  );
};

LineChart.defaultProps = {
  width: 580,
  height: 165,
  margin: { top: 16, bottom: 16, left: 16, right: 16 },
};

export default LineChart;
