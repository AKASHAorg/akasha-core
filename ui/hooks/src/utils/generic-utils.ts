export const validateType = <T>(arg1: T, type: string) => {
  if (typeof arg1 === type) {
    return true;
  }
  return false;
};
