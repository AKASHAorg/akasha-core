import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';

export interface ISubtitleRendererProps {
  textVariant?: TextProps['variant'];
  textAlign?: TextProps['align'];
  textColor?: TextProps['color'];
  subtitleLabels: { label: string; link?: string }[];
  onLinkClick: (link?: string) => () => void;
}

export const SubtitleRenderer: React.FC<ISubtitleRendererProps> = props => {
  const { textVariant, textAlign = 'center', textColor, subtitleLabels, onLinkClick } = props;

  return (
    <Text align={textAlign} variant={textVariant} color={textColor}>
      {subtitleLabels.map(el => (
        <React.Fragment key={el.label}>
          {!el.link && <>{el.label} </>}

          {el.link && (
            <>
              <Button plain={true} onClick={onLinkClick(el.link)}>
                <Text
                  as="span"
                  variant={textVariant}
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  weight="bold"
                  align="center"
                  customStyle="cursor-pointer"
                >
                  {el.label}
                </Text>
              </Button>{' '}
            </>
          )}
        </React.Fragment>
      ))}
    </Text>
  );
};
