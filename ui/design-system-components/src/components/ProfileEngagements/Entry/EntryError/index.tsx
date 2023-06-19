import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';

export type EntryErrorProps = {
  errorMessage?: string;
  onError: () => void;
};

const EntryError: React.FC<EntryErrorProps> = ({
  errorMessage = 'Oops! Something went wrong!',
  onError,
}) => {
  return (
    <InfoCard
      titleLabel={errorMessage}
      bodyLabel={
        <>Click {<Button label="here" variant="text" onClick={onError} />} to try again!</>
      }
    />
  );
};

export default EntryError;
