import { CardType } from '@/types';

export function detectCardType(raw: string): CardType {
    const digits = raw.replace(/\s/g, '');
    if (!digits) return 'unknown';

    // Amex: starts with 34 or 37
    if (/^3[47]/.test(digits)) return 'amex';

    // Mastercard: 51–55 or 2221–2720
    if (/^5[1-5]/.test(digits)) return 'mastercard';
    const num = parseInt(digits.slice(0, 4));
    if (num >= 2221 && num <= 2720) return 'mastercard';

    // Visa: starts with 4
    if (/^4/.test(digits)) return 'visa';

    return 'unknown';
}

export function getCardMaxLength(cardType: CardType): number {
    return cardType === 'amex' ? 15 : 16;
}

export function getCVVMaxLength(cardType: CardType): number {
    return cardType === 'amex' ? 4 : 3;
}

export function maskCardNumber(raw: string): string {
    const digits = raw.replace(/\s/g, ''); //removes spaces
    const last4 = digits.slice(-4); //takes last 4 digits
    return `**** **** **** ${last4}`; //returns masked card number
}

// Badge label for UI display
export function getCardLabel(cardType: CardType): string {
    const labels: Record<CardType, string> = {
        visa: 'VISA',
        mastercard: 'MC',
        amex: 'AMEX',
        unknown: '',
    };
    return labels[cardType];
}