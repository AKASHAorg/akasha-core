import styled from 'styled-components';

const StyledList = styled.ul`
  box-sizing: border-box;
  color: ${props => props.theme.colors.dark};
  font-family: ${props => props.theme.shapes.fontFamily};
  font-size: ${props => props.theme.spacing.fontSize};
  font-weight: ${props => props.theme.shapes.fontWeight.bold};
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const StyledRow = styled.li`
  align-items: center;
  border-radius: ${props => props.theme.shapes.borderRadius};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: ${props => props.theme.spacing.components.list.rowPadding};
  user-select: none;
  line-height: ${props => props.theme.spacing.lineHeight};

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }

  &::selection {
    background: ${props => props.theme.colors.darkBackground};
    color: ${props => props.theme.colors.darkGrey};
  }
`;

const StyledRowIcon = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 0;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.components.list.iconGap};
`;

const StyledRowText = styled.div`
  flex-grow: 1;
`;

const StyledRowNumber = styled.div`
  color: ${props => props.theme.colors.grey};
  flex-grow: 0;
  font-weight: ${props => props.theme.shapes.fontWeight.bold};
`;

export { StyledList, StyledRow, StyledRowIcon, StyledRowText, StyledRowNumber };
