import React from 'react';

export interface DividerProps {
  customStyle?: string;
}

/**
 * A Divider component provides a custom-styled \<hr\> tag divider.
 * @param customStyle - (optional) customize the style further
 * ```tsx
 *  <Divider />
 * ```
 **/
const Divider: React.FC<DividerProps> = ({ customStyle = '' }) => {
  return (
    <hr className={`rounded-[1.25rem] h-px w-full border-grey8 dark:border-grey3 ${customStyle}`} />
  );
};

export default Divider;
