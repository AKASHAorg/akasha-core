import DS from '@akashaorg/design-system';

const { AccordionPanel, Button, styled } = DS;

const StyledAccordionPanel = styled(AccordionPanel)`
  div:nth-child(2) {
    padding-right: 0;
  }
`;

const StyledButton = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};

  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    height: auto;
    padding: 1rem 0;
    width: 100%;
    svg {
      position: absolute;
      right: 2rem;
    }
  }
`;

export { StyledAccordionPanel, StyledButton };
