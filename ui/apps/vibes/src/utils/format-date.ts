import dayjs from 'dayjs';

/**
 * formate specified date string
 * @param date - valid date string
 * @param format -  valid format, (optional)
 * @returns string
 */
export const formatDate = (date: string | Date, format = 'DD MMM YYYY') => {
  return dayjs(date).format(format);
};
