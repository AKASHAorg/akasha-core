import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div<{ minHeight: number }>`
  width: 100%;
  display: flex;
  min-height: ${props => props.minHeight}px;
  justify-content: center;
  padding: 0.625em 0 0 0;
`;

const rotator = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dashoffset: 187;
  }
  50% {
    stroke-dashoffset: ${187 / 4};
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
`;

// const colors = keyframes`
//   0% {
//     stroke: #026337;
//   }
//   25% {
//     stroke: #c5dbcf;
//   }
//   50% {
//     stroke: #003a63;
//   }
//   75% {
//     stroke: #c75c35;
//   }
//   100% {
//     stroke: #c7985c;
//   }
// `;

const myCircle = ({ className }: { className?: string }) => (
  <circle
    className={className}
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    cx="33"
    cy="33"
    r="30"
  />
);

const StyledCircle = styled(myCircle)`
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  stroke: ${props => props.theme.colors.border};
  animation: ${dash} 1.4s ease-in-out infinite;
`;

const StyledSpinner = styled.svg`
  animation: ${rotator} 1.4s linear infinite;
  width: ${props => props.width}px;
  height: ${props => props.width}px;
`;

export interface SpinnerProps {
  /** the size (width, height) of the spinner. @default 50 */
  size?: number;
  /** speed (in seconds). ex: 1.2 or 2. @default 1.2 */
  speed?: number;
  style?: React.CSSProperties;
}

const Spinner: React.FC<SpinnerProps> = props => {
  const { size = 50 } = props; // , speed = 1.2
  return (
    <Wrapper minHeight={size} style={props.style}>
      <StyledSpinner width={size} height={size} viewBox="0 0 66 66">
        <StyledCircle />
      </StyledSpinner>
    </Wrapper>
  );
};
export default Spinner;
