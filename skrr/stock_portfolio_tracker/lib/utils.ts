import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency.
 * @param value The number to format.
 * @param currency The currency code (e.g., 'USD', 'KRW').
 * @param locale The locale string (e.g., 'en-US', 'ko-KR').
 * @returns A formatted currency string.
 */
export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Formats a number as a percentage string.
 * @param value The number to format (e.g., 7.14).
 * @returns A formatted percentage string (e.g., '7.14%').
 */
export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};
