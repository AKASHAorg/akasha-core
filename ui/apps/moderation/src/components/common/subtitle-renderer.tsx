import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface ISubtitleRendererProps {
  subtitleLabels: { label: string; link?: string }[];
  onLinkClick: (link?: string) => () => void;
}

export const SubtitleRenderer: React.FC<ISubtitleRendererProps> = props => {
  const { subtitleLabels, onLinkClick } = props;

  return (
    <Text align="center">
      {subtitleLabels.map(el => (
        <React.Fragment key={el.label}>
          {!el.link && <>{el.label} </>}

          {el.link && (
            <>
              <Button plain={true} onClick={onLinkClick(el.link)}>
                <Text
                  as="span"
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
