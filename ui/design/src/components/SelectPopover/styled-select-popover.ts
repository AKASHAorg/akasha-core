import { Drop, RadioButton } from 'grommet';
import styled from 'styled-components';

export interface IStyledDrop {
  gap?: string;
}

const StyledDrop = styled(Drop)<IStyledDrop>`
  margin-top: ${props => (props.gap ? props.gap : '0.313em')};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  width: 13.938em !important;
`;

const StyledListElem = styled.div`
  ${props =>
    `&:hover {
        // background-color: ${props.theme.colors.lightBackground};
        cursor: pointer;
      }
      border-bottom: 1px solid ${props.theme.colors.border};
      height: 3rem;
      display: flex;
      align-items: center;
      
    `}
`;

const StyledBox = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledRadioButton = styled(RadioButton)``;

export { StyledBox, StyledDrop, StyledListElem, StyledRadioButton };
