import { useState } from 'react';

export function useAccordion() {
  const [active, setActive] = useState<number | null>(null);

  const handleAccordionClick = (id: number) => {
    // console.log('check:', id, activeAcc);
    /**
     * if id is already active, set null so as to collapse it
     */
    setActive(id);
  };

  return { active, setActive, handleAccordionClick };
}
