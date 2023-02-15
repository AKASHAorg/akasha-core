export function getInputClasses(disabled: boolean) {
  const defaultClasses = `peer focus:outline-none w-full bg-transparent py-[0.4375rem] text-[0.875rem] leading-[1.375rem] font-light`;
  if (disabled) {
    return `${defaultClasses} dark:text-grey2 text-grey7`;
  }

  return `${defaultClasses} dark:text-white text-grey5`;
}
