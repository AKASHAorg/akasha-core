import React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type SubtitleLabel = {
  label: string;
  link?: string;
};
export type SubtitleRendererProps = {
  textVariant?: React.ComponentProps<typeof Typography>['variant'];
  subtitleLabels: SubtitleLabel[];
  className?: string;
  onLinkClick: (link?: string) => void;
};

/**
 * Component used in the vibes and vibes console apps to
 * create clickable text from a list of subtitles
 */
export const SubtitleRenderer: React.FC<SubtitleRendererProps> = props => {
  const { textVariant, subtitleLabels, className = '', onLinkClick } = props;
  const handleLinkClick = (link: string) => () => {
    onLinkClick(link);
  };
  return (
    <Typography variant={textVariant} className={className}>
      {subtitleLabels.map(el => (
        <React.Fragment key={el.label}>
          {!el.link && <>{el.label} </>}

          {el.link && (
            <>
              <button onClick={handleLinkClick(el.link)}>
                <Typography
                  variant={textVariant}
                  className="text-secondaryLight dark:text-secondaryDark text-center"
                >
                  {el.label}
                </Typography>
              </button>
            </>
          )}
        </React.Fragment>
      ))}
    </Typography>
  );
};
