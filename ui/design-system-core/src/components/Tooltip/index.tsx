import React, { useState, PropsWithChildren, ReactNode } from 'react';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { apply, tw } from '@twind/core';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';
import { Placement } from '@popperjs/core';
import { getArrowClasses } from './getArrowClasses';
import { getContentClasses } from './getContentClasses';
import { Color } from '../types/common.types';

export type TooltipProps = {
  placement: 'top' | 'left' | 'bottom' | 'right';
  content: ReactNode;
  textSize?: TextProps['variant'];
  textColor?: Color;
  trigger?: 'hover' | 'click';
  centerArrowToReference?: boolean;
  arrow?: boolean;
  backgroundColor?: Color;
  customStyle?: string;
  contentCustomStyle?: string;
};

const ARROW_SIZE = 4;

type CSSPosition = 'top' | 'left' | 'bottom' | 'right';

const PLACEMENT_TO_CSS_POSITION_MAP: Record<TooltipProps['placement'], CSSPosition> = {
  right: 'left',
  left: 'right',
  bottom: 'top',
  top: 'bottom',
};

const Tooltip: React.FC<
  PropsWithChildren<
    TooltipProps | ({ open: boolean; onOpen: () => void; onClose: () => void } & TooltipProps)
  >
> = props => {
  const {
    placement = 'bottom',
    content,
    textSize = 'subtitle2',
    trigger = 'hover',
    centerArrowToReference,
    arrow = true,
    textColor = { light: 'black', dark: 'white' },
    backgroundColor = { light: 'secondaryDark/50', dark: 'grey4' },
    customStyle = '',
    contentCustomStyle,
    children,
  } = props;

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

  const contentRef = React.createRef<HTMLDivElement>();

  useClickAway(contentRef, () => {
    if ('open' in props) {
      props.onClose();
      return;
    }
    setShowTooltip(false);
  });

  const contextualPlacement = getContextualPlacement(state?.placement);

  const arrowStyle = centerArrowToReference ? styles.arrow : {};

  const isContentOfTypeString = typeof content === 'string';

  const contentStyle = isContentOfTypeString ? 'rounded-md py-[4px] px-[16px]' : '';

  const eventHandlers =
    trigger === 'hover'
      ? {
          onMouseOver: () => {
            if ('open' in props) {
              props.onOpen();
              return;
            }
            setShowTooltip(true);
          },
          onMouseOut: () => {
            if ('open' in props) {
              props.onClose();
              return;
            }
            setShowTooltip(false);
          },
        }
      : {
          onClick: () => {
            if ('open' in props) {
              props.onOpen();
              return;
            }
            setShowTooltip(true);
          },
        };

  return (
    <Stack customStyle={customStyle}>
      <div {...eventHandlers} className={tw(apply`w-fit cursor-pointer`)} ref={setReferenceElement}>
        {children}
      </div>
      {('open' in props ? props.open : showTooltip) && (
        <div
          ref={setContent}
          style={{ ...styles.popper, zIndex: 99 }}
          {...attributes.popper}
          className={tw(getContentClasses(contextualPlacement, ARROW_SIZE))}
        >
          {arrow && (
            <div
              ref={setArrowElement}
              style={{
                ...arrowStyle,
                [PLACEMENT_TO_CSS_POSITION_MAP[contextualPlacement]]: `-${ARROW_SIZE}px`,
              }}
              className={tw(getArrowClasses(contextualPlacement, ARROW_SIZE, backgroundColor))}
            />
          )}
          <Stack
            ref={contentRef}
            align="center"
            justify="center"
            background={isContentOfTypeString ? backgroundColor : null}
            customStyle={`flex-wrap ${contentStyle} ${contentCustomStyle}`}
          >
            {isContentOfTypeString ? (
              <Text color={textColor} variant={textSize}>
                {content}
              </Text>
            ) : (
              content
            )}
          </Stack>
        </div>
      )}
    </Stack>
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
