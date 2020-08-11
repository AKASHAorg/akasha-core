import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/ro';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export type ILocale = 'es' | 'ro' | 'en';

const formatDate = (date: any, locale?: ILocale) => {
  if (dayjs(date).isValid()) {
    if (locale) {
      return dayjs.unix(date).locale(locale).format('D MMMM YYYY  H[h]mm');
    }
    return dayjs.unix(date).format('D MMMM YYYY  H[h]mm');
  }
  return '';
};

const formatDateShort = (date: any, locale?: ILocale) => {
  if (dayjs(date).isValid()) {
    if (locale) {
      return dayjs.unix(date).locale(locale).format('D MMMM YYYY');
    }
    return dayjs.unix(date).format('D MMMM YYYY');
  }
  return '';
};

const formatRelativeTime = (date: any, locale?: ILocale) => {
  if (dayjs(date).isValid()) {
    if (locale) {
      return dayjs.unix(date).locale(locale).fromNow();
    }
    return dayjs.unix(date).fromNow();
  }
  return '';
};

export { formatDate, formatDateShort, formatRelativeTime };
