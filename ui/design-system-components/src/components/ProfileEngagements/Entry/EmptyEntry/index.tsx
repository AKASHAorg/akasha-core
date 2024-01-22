import React from 'react';
import InfoCard, { InfoCardProps } from '@akashaorg/design-system-core/lib/components/InfoCard';

export type EmptyEntryProps = Pick<InfoCardProps, 'titleLabel' | 'bodyLabel'>;

const EmptyEntry: React.FC<EmptyEntryProps> = props => {
  const { titleLabel, bodyLabel } = props;

  return <InfoCard titleLabel={titleLabel} bodyLabel={bodyLabel} assetName="longbeam-notfound" />;
};

export default EmptyEntry;
