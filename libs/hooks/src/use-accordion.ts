import { useState } from 'react';

export function useAccordion() {
  const [active, setActive] = useState<number | null>(null);

  const handleAccordionClick = (id: number) => {
    /**
     * if id is already active, set null so as to collapse it
     */
    if (id === active) {
      setActive(null);
    } else {
      setActive(id);
    }
  };

  return { active, setActive, handleAccordionClick };
}
