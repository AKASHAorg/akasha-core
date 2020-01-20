import { Drop } from 'grommet';
import styled from 'styled-components';

export interface IStyledDrop {
  gap?: string;
}

const StyledDrop = styled(Drop)<IStyledDrop>`
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  width: 223px !important;
`;

const StyledListElem = styled.div`
  ${props =>
    `&:hover {
        background-color: ${props.theme.colors.lightBackground};
        cursor: pointer;
      }
      border-bottom: 1px solid ${props.theme.colors.border}
      height: 49px;
      display: flex;
      align-items: center;
      
    `}
`;

const StyledBox = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export { StyledBox, StyledDrop, StyledListElem };
