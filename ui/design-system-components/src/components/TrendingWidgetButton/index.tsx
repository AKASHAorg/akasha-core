import React, {
  useEffect,
  useState,
  EventHandler,
  SyntheticEvent,
  forwardRef,
  LegacyRef,
} from 'react';
import { tw } from '@twind/core';

import { IconType } from '@akashaorg/typings/lib/ui';

import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  BUTTON_SIZE_MAP,
  BUTTON_SIZE_PADDING_MAP,
  BUTTON_SIZE_TEXT_MAP,
} from '@akashaorg/design-system-core/lib/components/Button';
import { ButtonProps } from '@akashaorg/design-system-core/lib/components/Button/types';

export type TrendingWidgetButtonProps = Pick<
  ButtonProps,
  'size' | 'disabled' | 'breakPointSize' | 'variant'
> & {
  active: boolean;
  activeLabel: string;
  activeIcon: IconType;
  inactiveLabel: string;
  activeHoverLabel: string;
  activeHoverIcon: IconType;
  loading: boolean;
  customStyle?: string;
  onClickActive: EventHandler<SyntheticEvent>;
  onClickInactive: EventHandler<SyntheticEvent>;
};

const TrendingWidgetButton: React.FC<TrendingWidgetButtonProps> = forwardRef((props, ref) => {
  const {
    active,
    activeLabel,
    activeIcon,
    inactiveLabel,
    activeHoverLabel,
    activeHoverIcon,
    onClickActive,
    onClickInactive,
    loading,
    size = 'sm',
    breakPointSize,
    disabled = false,
    variant = 'secondary',
    customStyle = '',
  } = props;

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (active) setHovered(false);
  }, [active]);

  const getLabel = () => {
    if (active) return hovered ? activeHoverLabel : activeLabel;
    return inactiveLabel;
  };

  const containerStyle = `border(1 secondaryLight dark:secondaryDark ${
    active ? 'hover:errorLight dark:hover:errorDark' : ''
  })`;

  const textStyle = `text(secondaryLight ${
    active ? 'group-hover:errorLight dark:group-hover:errorDark' : ''
  } dark:secondaryDark )`;

  return (
    <button
      ref={ref as LegacyRef<HTMLButtonElement>}
      type="button"
      className={tw(customStyle)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={active ? onClickActive : onClickInactive}
    >
      <Stack
        direction="row"
        align="center"
        justify="center"
        spacing="gap-x-1"
        customStyle={`group ${containerStyle} ${BUTTON_SIZE_MAP[size]} ${
          variant !== 'text' ? BUTTON_SIZE_PADDING_MAP[size] : ''
        }`}
      >
        {loading ? (
          <Icon
            size={size}
            type="ArrowPathIcon"
            breakPointSize={breakPointSize}
            accentColor={true}
            customStyle="animate-spin"
            disabled={disabled}
          />
        ) : (
          <>
            {active && (
              <Icon
                size={size}
                type={hovered ? activeHoverIcon : activeIcon}
                breakPointSize={breakPointSize}
                color={
                  hovered
                    ? { light: 'errorLight', dark: 'errorDark' }
                    : { light: 'secondaryLight', dark: 'secondaryDark' }
                }
                accentColor={!hovered}
                hover={!disabled}
                disabled={disabled}
              />
            )}

            <Text as="span" variant={BUTTON_SIZE_TEXT_MAP[size]} customStyle={textStyle}>
              {getLabel()}
            </Text>
          </>
        )}
      </Stack>
    </button>
  );
});

export default TrendingWidgetButton;
