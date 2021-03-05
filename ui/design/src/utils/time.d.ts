import 'dayjs/locale/es';
import 'dayjs/locale/ro';
export declare type ILocale = 'es' | 'ro' | 'en';
declare const formatDate: (date: any, locale?: 'es' | 'ro' | 'en' | undefined) => string;
declare const formatDateShort: (date: any, locale?: 'es' | 'ro' | 'en' | undefined) => string;
declare const formatRelativeTime: (date: any, locale?: 'es' | 'ro' | 'en' | undefined) => string;
export { formatDate, formatDateShort, formatRelativeTime };
