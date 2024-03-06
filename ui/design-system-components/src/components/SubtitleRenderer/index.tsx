import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';

export type SubtitleLabel = { label: string; link?: string };

export type SubtitleRendererProps = {
  textVariant?: TextProps['variant'];
  textAlign?: TextProps['align'];
  textColor?: TextProps['color'];
  fontWeight?: TextProps['weight'];
  subtitleLabels: SubtitleLabel[];
  onLinkClick: (link?: string) => void;
};

export const SubtitleRenderer: React.FC<SubtitleRendererProps> = props => {
  const {
    textVariant,
    textAlign = 'center',
    textColor,
    fontWeight,
    subtitleLabels,
    onLinkClick,
  } = props;

  const handleLinkClick = (link: string) => () => {
    onLinkClick(link);
  };

  return (
    <Text align={textAlign} variant={textVariant} color={textColor} weight={fontWeight}>
      {subtitleLabels.map(el => (
        <React.Fragment key={el.label}>
          {!el.link && <>{el.label} </>}

          {el.link && (
            <>
              <Button plain={true} onClick={handleLinkClick(el.link)}>
                <Text
                  as="span"
                  variant={textVariant}
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  weight={fontWeight}
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
