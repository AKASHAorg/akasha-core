import React, { PropsWithChildren, useEffect } from 'react';

type NSFWBlockType = {
  nsfw: boolean;
  onNsfwChange: (nsfw: boolean) => void;
};
const NSFWBlock: React.FC<PropsWithChildren<NSFWBlockType>> = props => {
  const { nsfw, children, onNsfwChange } = props;

  useEffect(() => {
    onNsfwChange(nsfw);
  }, [nsfw, onNsfwChange]);

  return <>{children}</>;
};

export default NSFWBlock;
