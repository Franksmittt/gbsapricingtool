// This file will hold shared helper functions for formatting data.
/**
 * Formats a number as South African Rand (ZAR).
 * Returns 'N/A' if the value is not a valid number.
 */
export const formatCurrency = (value: number | null): string => {
  if (value === null || typeof value === 'undefined' || isNaN(value)) {
    return 'N/A';
  }
  
  // Use Intl.NumberFormat with specific options for consistency
  // This ensures the same formatting on both server and client, preventing hydration errors.
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};