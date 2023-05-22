import React, { ReactNode } from 'react';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export interface ISwitchCard {
  loggedUser: string | null;
  hasIcon?: boolean;
  activeButton: string;
  buttonValues: { value: string; label: string }[];
  onIconClick?: () => void;
  onTabClick: (value: string) => () => void;
  style?: string;
  className?: string;
}

export interface IStickyBoxProps {
  readonly userSignedIn?: boolean;
  children?: ReactNode;
}

const StickyBox: React.FC<IStickyBoxProps> = props => {
  const { userSignedIn, children } = props;
  return (
    <Stack customStyle={`sticky flex top-${userSignedIn ? '[3rem]' : '[6rem]'}`} fullWidth>
      <Box customStyle="grid grid-cols-3 w-full">{children}</Box>
    </Stack>
  );
};

const SwitchCard: React.FC<ISwitchCard> = props => {
  const {
    loggedUser,
    activeButton,
    // hasIcon = false,
    buttonValues,
    onIconClick,
    onTabClick,
    style,
    className,
  } = props;

  const baseStyle = 'group p-2';

  const activeStyle = `border-b ${getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'border',
  )}`;
  const hoverStyle = `hover:border-b ${getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'hover:border',
  )}`;

  return (
    <>
      <StickyBox userSignedIn={!!loggedUser}>
        {buttonValues.map((el: { value: string; label: string }, idx: number) => (
          <Box
            key={idx}
            customStyle={`py-2 px-3 ${baseStyle} ${hoverStyle} ${
              el.value === activeButton ? activeStyle : ''
            }`}
            onClick={() => onTabClick(buttonValues[idx].value)}
          >
            <Text
              color={
                el.value === activeButton
                  ? {
                      light: 'secondaryLight',
                      dark: 'secondaryDark',
                    }
                  : 'grey7'
              }
              weight={el.value === activeButton ? 'bold' : 'normal'}
              align="center"
              customStyle={getColorClasses(
                {
                  light: 'secondaryLight',
                  dark: 'secondaryDark',
                },
                'group-hover:text',
              )}
            >
              {el.label}
            </Text>
          </Box>
        ))}
      </StickyBox>
    </>
  );
};

export default SwitchCard;
