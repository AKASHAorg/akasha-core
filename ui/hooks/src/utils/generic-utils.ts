export const validateType = <T>(arg1: T, type: string) => {
  return typeof arg1 === type;
};
