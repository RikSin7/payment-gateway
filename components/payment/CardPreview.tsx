import { CardType } from '@/types';
import { getCardLabel } from '@/utils/cardUtils';

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cardType: CardType;
}

export default function CardPreview({ cardNumber, cardholderName, expiry, cardType }: CardPreviewProps) {
  // Pad the card number with placeholder dots for a realistic preview
  const displayCardNumber = cardNumber.padEnd(19, '•').substring(0, 19);
  const displayName = cardholderName.trim() || 'CARDHOLDER NAME';
  const displayExpiry = expiry || 'MM/YY';

  return (
    <div className="w-full max-w-md mx-auto aspect-[1.586/1] rounded-xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 bg-bg-secondary text-text-primary relative overflow-hidden">
      {/* Decorative gradient overlay for the card look */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Top row: Chip and Card Type Logo */}
      <div className="flex justify-between items-center relative z-10">
        <div className="w-12 h-10 bg-yellow-400/80 rounded-md shadow-sm border border-yellow-500/50" />
        <span className="font-bold italic text-lg tracking-wider opacity-80">
          {getCardLabel(cardType)}
        </span>
      </div>

      {/* Middle row: Card Number */}
      <div className="relative z-10 mt-4">
        <p className="font-mono text-2xl tracking-[0.15em] tabular-nums">
          {displayCardNumber}
        </p>
      </div>

      {/* Bottom row: Name and Expiry */}
      <div className="flex justify-between items-end relative z-10 mt-2">
        <div className="flex flex-col uppercase tracking-widest max-w-[70%]">
          <span className="text-[10px] opacity-60 mb-1">Cardholder Name</span>
          <span className="font-semibold truncate text-sm">{displayName}</span>
        </div>
        <div className="flex flex-col uppercase tracking-widest text-right">
          <span className="text-[10px] opacity-60 mb-1">Expires</span>
          <span className="font-mono font-semibold text-sm">{displayExpiry}</span>
        </div>
      </div>
    </div>
  );
}