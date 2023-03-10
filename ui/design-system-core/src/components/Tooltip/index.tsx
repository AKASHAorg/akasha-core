import React, { ReactNode, useState, PropsWithChildren } from 'react';
import Text, { TextProps } from '../Text';
import Stack from '../Stack';
import { usePopper } from 'react-popper';
import { apply, tw } from '@twind/core';
import { getArrowClasses } from './getArrowClasses';
import { getContentClasses } from './getContentClasses';
import { Placement } from '@popperjs/core';

export type TooltipProps = {
  content: ReactNode;
  textSize?: TextProps['variant'];
  placement: 'top' | 'left' | 'bottom' | 'right';
  centerArrowToReference?: boolean;
};

const ARROW_SIZE = 4;

type CSSPosition = 'top' | 'left' | 'bottom' | 'right';

const PLACEMENT_TO_CSS_POSITION_MAP: Record<TooltipProps['placement'], CSSPosition> = {
  right: 'left',
  left: 'right',
  bottom: 'top',
  top: 'bottom',
};

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  placement = 'bottom',
  textSize = 'subtitle2',
  content,
  centerArrowToReference,
  children,
}) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [contentElement, setContent] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const arrowModifier = {
    name: 'arrow',
    options: {
      element: arrowElement,
    },
  };
  const offsetModifier = {
    name: 'offset',
    options: {
      offset: [0, ARROW_SIZE],
    },
  };

  const { styles, attributes, state } = usePopper(referenceElement, contentElement, {
    placement,
    modifiers: centerArrowToReference ? [arrowModifier, offsetModifier] : [arrowModifier],
  });

  const contextualPlacement = getContextualPlacement(state?.placement);

  const arrowStyle = centerArrowToReference ? styles.arrow : {};

  return (
    <>
      <div
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        className={tw('w-fit')}
        ref={setReferenceElement}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          ref={setContent}
          style={{ ...styles.popper, zIndex: 99 }}
          {...attributes.popper}
          className={tw(apply(getContentClasses(contextualPlacement, ARROW_SIZE)))}
        >
          <div
            ref={setArrowElement}
            style={{
              ...arrowStyle,
              [PLACEMENT_TO_CSS_POSITION_MAP[contextualPlacement]]: `-${ARROW_SIZE}px`,
            }}
            className={tw(apply(getArrowClasses(contextualPlacement, ARROW_SIZE)))}
          />
          <Stack
            align="center"
            justify="center"
            style="flex-wrap rounded-md bg-secondary-dark/50 dark:bg-grey4 py-[4px] px-[16px]"
          >
            <Text variant={textSize} color={{ light: 'text-black', dark: 'dark:text-white' }}>
              {content}
            </Text>
          </Stack>
        </div>
      )}
    </>
  );
};

function getContextualPlacement(placement: Placement) {
  if (
    placement === 'top' ||
    placement === 'bottom' ||
    placement === 'left' ||
    placement === 'right'
  )
    return placement;

  return 'bottom';
}

export default Tooltip;
