export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    PKR: 'Rs. ',
    CAD: 'CA$',
    AUD: 'AU$',
  };

  const symbol = symbolMap[currency] || '$';
  return `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};
