import styled from 'styled-components';
import StyledIconLink from './styled-icon-link';

const ButtonTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  ${StyledIconLink} {
    line-height: 1.5em;
    font-weight: bolder;
    color: ${props => props.theme.colors.primaryText};
  }
`;

const ButtonInfo = styled.div`
  font-size: 0.867em;
  padding: 0 0.8em;
  line-height: 1.5em;
  font-weight: lighter;
`;

export { ButtonTextWrapper, ButtonInfo };
