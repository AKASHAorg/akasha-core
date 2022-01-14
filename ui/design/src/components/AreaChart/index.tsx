import * as React from 'react';
import { Group } from '@visx/group';
import { curveLinear } from '@visx/curve';
import { scaleTime, scaleLinear, TimeDomain } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { extent, max } from 'd3-array';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import useSimpleClickAway from '../../utils/simpleClickAway';

export interface IAreaChart {
  data: IMentionData[];
  width: number;
  height: number;
  margin: { top: number; bottom: number; left: number; right: number };
}

export interface IMentionData {
  mentions: number;
  date: number;
}

const AreaChart: React.FC<IAreaChart> = props => {
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

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip();

  useSimpleClickAway(tooltipWrapperRef, () => hideTooltip());

  // define accessor functions
  const getX = (d: IMentionData) => new Date(d.date);
  const getY = (d: IMentionData) => d.mentions;

  // define scales
  const xScale = React.useMemo(
    () => scaleTime({ range: [0, xMax], domain: extent(data, getX) as TimeDomain }),
    [data, xMax],
  );

  const yScale = React.useMemo(
    () => scaleLinear({ range: [yMax, 0], domain: [0, max(data, getY)] as TimeDomain, nice: true }),
    [data, yMax],
  );

  const handleTooltip = React.useCallback(
    (
      event: React.TouchEvent<SVGCircleElement> | React.MouseEvent<SVGCircleElement>,
      pointData: IMentionData,
    ) => {
      if (!svgRef.current) return;
      const { x, y } = localPoint(svgRef.current, event) || { x: 0, y: 0 };
      showTooltip({
        tooltipData: pointData,
        tooltipLeft: x,
        tooltipTop: y,
      });
    },
    [showTooltip],
  );

  const chart = (
    <svg width={width} height={height} ref={svgRef}>
      <Group top={margin.top} left={margin.left}>
        <AreaClosed
          data={data}
          x={d => xScale(getX(d)) || 0}
          y={d => yScale(getY(d)) || 0}
          yScale={yScale}
          fill={'rgba(78,113,255,0.08)'}
        />
        <LinePath
          curve={curveLinear}
          data={data}
          x={d => xScale(getX(d)) || 0}
          y={d => yScale(getY(d)) || 0}
          stroke={'#4E71FF'}
          strokeWidth={1}
          shapeRendering="geometricPrecision"
          pointerEvents="none"
        />

        {data.map((d, i) => (
          <circle
            key={i}
            r={3}
            cx={xScale(getX(d))}
            cy={yScale(getY(d))}
            strokeWidth={1}
            stroke={'#FFF'}
            fill={'#4E71FF'}
            onClick={ev => handleTooltip(ev, d)}
            onTouchStart={ev => handleTooltip(ev, d)}
            cursor="pointer"
          />
        ))}
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

AreaChart.defaultProps = {
  width: 300,
  height: 65,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
};

export default AreaChart;
