import React from 'react';
import Button from '../../../Button';
import InfoCard from '../../../InfoCard';
import Text from '../../../Text';

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
      subTitleLabel={
        <>Click {<Button label="here" variant="text" onClick={onError} />} to try again!</>
      }
    />
  );
};

export default EntryError;
