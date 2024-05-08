/**
 * @param val - Data value
 * @returns object with data attribute
 */
export const createFormattedValue = <T>(val: T): { data: T } => {
  return { data: val };
};
