import { useLocalStorage } from './useLocalStorage';

export interface Currency {
    code: string;
    symbol: string;
    name: string;
    position: 'before' | 'after';
}

export const CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before' },
    { code: 'EUR', symbol: '€', name: 'Euro', position: 'before' },
    { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'before' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'before' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', position: 'before' },
];

const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

export function useCurrency() {
    const [currencyCode, setCurrencyCode] = useLocalStorage<string>('pet-expenses-currency', DEFAULT_CURRENCY.code);

    const currency = CURRENCIES.find(c => c.code === currencyCode) || DEFAULT_CURRENCY;

    const formatAmount = (amount: number, decimals: number = 2): string => {
        const formatted = amount.toFixed(decimals);
        return currency.position === 'before'
            ? `${currency.symbol}${formatted}`
            : `${formatted}${currency.symbol}`;
    };

    const setCurrency = (code: string) => {
        const found = CURRENCIES.find(c => c.code === code);
        if (found) {
            setCurrencyCode(code);
        }
    };

    return {
        currency,
        currencyCode,
        setCurrency,
        formatAmount,
        symbol: currency.symbol,
        currencies: CURRENCIES,
    };
}
