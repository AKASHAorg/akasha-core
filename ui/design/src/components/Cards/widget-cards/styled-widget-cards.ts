import { Text } from 'grommet';
import styled from 'styled-components';
import { Button } from '../../Buttons';
import { BasicCardBox } from '../index';

const StyledWidgetCard = styled(BasicCardBox)`
  width: 21rem;
`;

const StyledButton = styled(Button)`
  width: 50%;
`;

const StyledText = styled(Text)`
  text-transform: uppercase;
`;

export { StyledWidgetCard, StyledText, StyledButton };
