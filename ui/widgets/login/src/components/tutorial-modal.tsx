import * as React from 'react';
import { ModalContainer } from './modal-container';
import DS from '@akashaproject/design-system';
import { HorizontalDivider } from './dividers';

const { Box, ModalCard, IconLink, IconButton, Icon, Text, Carousel } = DS;
export interface ITutorialSlide {
  title: string;
  content: string;
}
export interface ILearnMoreModalProps {
  onModalClose: () => void;
  slides: ITutorialSlide[];
}
export const LearnMoreTutorial = (props: ILearnMoreModalProps) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <Carousel controls="selectors" style={{ padding: '2em' }}>
          {props.slides.map((slide, idx) => (
            <Box height={{ min: '10rem' }} align="center" key={`${idx}-${slide.title}`}>
              <Text weight="bold" size="large">
                {slide.title}
              </Text>
              <Text>{slide.content}</Text>
            </Box>
          ))}
        </Carousel>
        <HorizontalDivider />
        <Box justify="between" direction="row" margin={{ top: '1em' }}>
          <IconLink label="Skip tutorial" onClick={props.onModalClose} />
          <IconButton
            label="Next"
            icon={<Icon type="arrowRight" />}
            reverse={true}
            primary={true}
          />
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};
