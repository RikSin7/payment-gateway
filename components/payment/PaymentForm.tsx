'use client';

import React, { useState, useMemo } from 'react';
import CardPreview from './CardPreview';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { useAppSelector } from '@/store/hooks';
import { FormFields, FormErrors, PaymentPayload } from '@/types';
import { detectCardType } from '@/utils/cardUtils';
import {
  formatCardNumber, formatExpiry, formatAmountInput,
  formatCVV
} from '@/utils/formatters';
import {
  validateCardholderName, validateCardNumber, validateExpiry, validateCVV, validateAmount
} from '@/utils/validators';
import { generateTransactionId } from '@/utils/idempotency';
import { cn } from '@/utils/cn';

export default function PaymentForm() {
  const { processPayment } = usePaymentFlow();
  const { status } = useAppSelector((state) => state.payment);
  const isProcessing = status === 'processing';

  // Local Form State
  const [formData, setFormData] = useState<FormFields>({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: '',
    currency: 'INR',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const cardType = useMemo(
    () => detectCardType(formData.cardNumber),
    [formData.cardNumber]
  );

  const isFormValid = useMemo(() => {
    return (
      !validateCardholderName(formData.cardholderName) &&
      !validateCardNumber(formData.cardNumber) &&
      !validateExpiry(formData.expiry) &&
      !validateCVV(formData.cvv, cardType) &&
      !validateAmount(formData.amount)
    );
  }, [formData, cardType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Route to the correct formatter
    switch (name) {
      case 'cardNumber': formattedValue = formatCardNumber(value); break;
      case 'expiry': formattedValue = formatExpiry(value); break;
      case 'amount': formattedValue = formatAmountInput(value); break;
      case 'cvv': formattedValue = formatCVV(value); break;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    // Clear error for this field as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMsg: string | undefined;

    // Route to the correct validator
    switch (name) {
      case 'cardholderName': errorMsg = validateCardholderName(value); break;
      case 'cardNumber': errorMsg = validateCardNumber(value); break;
      case 'expiry': errorMsg = validateExpiry(value); break;
      case 'cvv': errorMsg = validateCVV(value, cardType); break;
      case 'amount': errorMsg = validateAmount(value); break;
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isProcessing) return;

    const payload: PaymentPayload = {
      ...formData,
      amount: parseFloat(formData.amount),
      cardNumber: formData.cardNumber.replace(/\s/g, ''),
      transactionId: generateTransactionId(),
    };

    await processPayment({ payload, attempt: 1 });
  };

  // Shared generic input class using your CSS variables
  const inputBase = "w-full bg-bg-primary border border-scrollbar-thumb text-text-primary rounded-md px-4 py-2 mt-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/30 focus-visible:border-accent disabled:opacity-50 transition-colors";

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto">

      {/* Left Column: Card Preview */}
      <div className="w-full lg:w-1/2 flex items-start justify-center pt-4">
        <CardPreview
          cardNumber={formData.cardNumber}
          cardholderName={formData.cardholderName}
          expiry={formData.expiry}
          cardType={cardType}
        />
      </div>

      {/* Right Column: The Form */}
      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-5 bg-bg-surface p-6 rounded-xl shadow-sm border border-scrollbar-thumb/20">

        {/* Name Input */}
        <div>
          <label htmlFor="cardholderName" className="text-sm font-medium text-text-secondary">Cardholder Name</label>
          <input
            id="cardholderName" name="cardholderName" type="text"
            value={formData.cardholderName} onChange={handleChange} onBlur={handleBlur}
            disabled={isProcessing}
            className={cn(inputBase, errors.cardholderName && 'border-error')}
            aria-invalid={!!errors.cardholderName} aria-describedby="name-error"
          />
          {errors.cardholderName && <p id="name-error" className="text-error text-xs mt-1">{errors.cardholderName}</p>}
        </div>

        {/* Card Number Input */}
        <div>
          <label htmlFor="cardNumber" className="text-sm font-medium text-text-secondary">Card Number</label>
          <input
            id="cardNumber" name="cardNumber" type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
            value={formData.cardNumber} onChange={handleChange} onBlur={handleBlur}
            disabled={isProcessing}
            className={cn(inputBase, 'font-mono', errors.cardNumber && 'border-error')}
            aria-invalid={!!errors.cardNumber} aria-describedby="cardNumber-error"
          />
          {errors.cardNumber && <p id="cardNumber-error" className="text-error text-xs mt-1">{errors.cardNumber}</p>}
        </div>

        {/* Expiry and CVV Row */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label htmlFor="expiry" className="text-sm font-medium text-text-secondary">Expiry Date</label>
            <input
              id="expiry" name="expiry" type="text" placeholder="MM/YY"
              value={formData.expiry} onChange={handleChange} onBlur={handleBlur}
              disabled={isProcessing}
              className={cn(inputBase, 'font-mono', errors.expiry && 'border-error')}
              aria-invalid={!!errors.expiry} aria-describedby="expiry-error"
            />
            {errors.expiry && <p id="expiry-error" className="text-error text-xs mt-1">{errors.expiry}</p>}
          </div>
          <div className="w-1/2">
            <label htmlFor="cvv" className="text-sm font-medium text-text-secondary">CVV</label>
            <input
              id="cvv" name="cvv" type="text" inputMode="numeric" placeholder={cardType === 'amex' ? '1234' : '123'} maxLength={cardType === 'amex' ? 4 : 3}
              value={formData.cvv} onChange={handleChange} onBlur={handleBlur}
              disabled={isProcessing}
              className={cn(inputBase, 'font-mono', errors.cvv && 'border-error')}
              aria-invalid={!!errors.cvv} aria-describedby="cvv-error"
            />
            {errors.cvv && <p id="cvv-error" className="text-error text-xs mt-1">{errors.cvv}</p>}
          </div>
        </div>

        {/* Amount & Currency Row */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <label htmlFor="currency" className="text-sm font-medium text-text-secondary">Currency</label>
            <select
              id="currency" name="currency"
              value={formData.currency} onChange={handleChange}
              disabled={isProcessing}
              className={cn(inputBase)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="w-2/3">
            <label htmlFor="amount" className="text-sm font-medium text-text-secondary">Amount</label>
            <input
              id="amount" name="amount" type="text" inputMode="decimal" placeholder="0.00"
              value={formData.amount} onChange={handleChange} onBlur={handleBlur}
              disabled={isProcessing}
              className={cn(inputBase, errors.amount && 'border-error')}
              aria-invalid={!!errors.amount} aria-describedby="amount-error"
            />
            {errors.amount && <p id="amount-error" className="text-error text-xs mt-1">{errors.amount}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isProcessing}
          className="w-full mt-6 cursor-pointer bg-accent hover:bg-accent-hover text-accent-text font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-surface"
        >
          {isProcessing ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            `Pay ${formData.currency === 'INR' ? '₹' : '$'}${formData.amount || '0.00'}`
          )}
        </button>

      </form>
    </div>
  );
}