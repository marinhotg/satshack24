export const getCurrencyList = (): Array<{ code: string; name: string }> => {
    return [
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'BRL', name: 'Brazilian Real' },
      { code: 'CNY', name: 'Chinese Yuan' },
      { code: 'Other', name: '' },
    ];
  };
  