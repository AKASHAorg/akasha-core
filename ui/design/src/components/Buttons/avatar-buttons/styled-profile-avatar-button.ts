import styled from 'styled-components';
import StyledIconLink from '../icon-buttons/styled-icon-link';

const ButtonTextWrapper = styled.div`
  display: flex;
  padding: 0 0.8rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  ${StyledIconLink} {
    line-height: 1.5rem;
    font-weight: bolder;
    color: ${props => props.theme.colors.primaryText};
  }
`;

const ButtonInfo = styled.div`
  font-size: 0.867rem;
  line-height: 1rem;
  font-weight: lighter;
`;

export { ButtonTextWrapper, ButtonInfo };
