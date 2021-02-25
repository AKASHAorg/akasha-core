import * as React from 'react';
import { Box } from 'grommet';
import { BasicCardBox } from '../../Cards';
import styled, { css } from 'styled-components';

export interface IPlaceholderProps {
  style?: React.CSSProperties;
  height?: number;
  animated?: boolean;
}

const TextLine = styled(Box)<{ animated?: boolean }>`
  min-height: 18px;
  ${props => {
    if (props.animated) {
      return css`
        background: linear-gradient(
          90deg,
          ${props.theme.colors.lightBackground},
          #fff,
          ${props.theme.colors.lightBackground}
        );
        animation: bgRotate 1s ease infinite;
      `;
    }
    return css`
      background-color: ${props.theme.colors.lightBackground}a6;
    `;
  }}
`;

const EntryLoadingPlaceholder: React.FC<IPlaceholderProps> = props => {
  const { height = 200, animated = false } = props;
  return (
    <BasicCardBox style={{ minHeight: height, padding: '1em', ...props.style }}>
      <Box direction="row">
        <Box direction="row" align="center">
          <Box>
            <TextLine title="avatar" width="40px" height="40px" round={{ size: '50%' }} />
          </Box>
          <Box direction="column" margin={{ left: '8px' }}>
            <TextLine
              title="author name"
              width="220px"
              height={{ min: '18px' }}
              animated={animated}
            />
            <TextLine
              title="entry-publish-date"
              width="160px"
              margin={{ top: '4px' }}
              animated={animated}
            />
          </Box>
        </Box>
      </Box>
      <Box direction="column" margin={{ top: '1em' }}>
        <TextLine
          title="entry-publish-date"
          width="100%"
          margin={{ top: '4px' }}
          animated={animated}
        />
        <TextLine
          title="entry-publish-date"
          width="90%"
          margin={{ top: '4px' }}
          animated={animated}
        />
        <TextLine
          title="entry-publish-date"
          width="45%"
          margin={{ top: '4px' }}
          animated={animated}
        />
        <TextLine
          title="entry-publish-date"
          width="88%"
          margin={{ top: '4px' }}
          animated={animated}
        />
        <TextLine
          title="entry-publish-date"
          width="64%"
          margin={{ top: '4px' }}
          animated={animated}
        />
        {props.children}
      </Box>
    </BasicCardBox>
  );
};

export default EntryLoadingPlaceholder;
