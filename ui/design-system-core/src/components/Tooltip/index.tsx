import React, { ReactNode, useState, PropsWithChildren } from 'react';
import { usePopper } from 'react-popper';
import { tw } from '@twind/core';
import { getArrowClasses } from './getArrowClasses';
import { getContentClasses } from './getContentClasses';
import { Placement } from '@popperjs/core';
import Text from '../Text';

export type TooltipProps = {
  content: ReactNode;
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

  const arrowStyle = centerArrowToReference
    ? {
        style: {
          ...styles.arrow,
          [PLACEMENT_TO_CSS_POSITION_MAP[contextualPlacement]]: `-${ARROW_SIZE}px`,
        },
      }
    : {};

  return (
    <>
      <div
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        ref={setReferenceElement}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          ref={setContent}
          style={styles.popper}
          {...attributes.popper}
          className={tw(getArrowClasses(contextualPlacement, ARROW_SIZE))}
        >
          <div
            ref={setArrowElement}
            {...arrowStyle}
            className={tw(getContentClasses(contextualPlacement, ARROW_SIZE))}
          />
          <div
            className={tw(
              'flex items-center justify-center flex-wrap rounded-md bg-secondary-dark/50 dark:bg-grey4 py-[4px] px-[16px]',
            )}
          >
            <Text variant="subtitle2" color={{ light: 'text-black', dark: 'dark:text-white' }}>
              {content}
            </Text>
          </div>
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
