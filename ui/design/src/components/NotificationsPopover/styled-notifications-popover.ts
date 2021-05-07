import { Box, Drop } from 'grommet';
import styled from 'styled-components';

export interface IStyledDrop {
  gap?: string;
}

const StyledDrop = styled(Drop)<IStyledDrop>`
  margin-top: ${props => (props.gap ? props.gap : '-10px')};
  margin-left: 25px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  width: 336px;
`;

const StyledListElem = styled.div`
  ${props =>
    `&:hover {
        background-color: ${props.theme.colors.lightBackground};
        cursor: pointer;
      }
      border-radius: ${props.theme.shapes.borderRadius}
      height: 3em;
      display: flex;
      align-items: center;
    `}
`;

const StyledListContainer = styled(Box)`
  max-height: 320px;
`;

export { StyledDrop, StyledListElem, StyledListContainer };
