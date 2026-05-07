# Payment Gateway UI — Frontend Assignment

A production-grade payment gateway interface built with Next.js 15 (App Router), TypeScript, Redux Toolkit, and Tailwind CSS. Implements the full payment lifecycle including real-time validation, AbortController-based timeout handling, retry logic with idempotency, and persisted transaction history.

---

## Live Demo

https://payuonline.vercel.app/

## Repository

https://github.com/RikSin7/payment-gateway
---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
git clone https://github.com/RikSin7/payment-gateway
cd payment-gateway
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### No environment variables required
The mock gateway runs entirely via a Next.js Route Handler at `/api/pay`.
No third-party payment SDK is used.

---

## Project Structure

payment-gateway/
├── app/
│   ├── api/
│   │   └── pay/
│   │       └── route.ts          # Mock gateway (60/25/15 distribution)
│   ├── error.tsx                 # Error boundary
│   ├── favicon.ico
│   ├── globals.css               # Tailwind + CSS custom properties
│   ├── layout.tsx                # Root layout with Redux + Theme providers
│   ├── loading.tsx               # Suspense fallback
│   ├── not-found.tsx
│   └── page.tsx                  # Server component entry point
├── components/
│   ├── history/
│   │   ├── HistoryItem.tsx       # Expandable row with full detail
│   │   └── TransactionHistory.tsx
│   ├── payment/
│   │   ├── CardPreview.tsx       # Live card visualiser
│   │   ├── PaymentForm.tsx       # Form with real-time validation
│   │   ├── PaymentPageClient.tsx # Client boundary
│   │   ├── RetryTracker.tsx      # Retry logic + attempt counter
│   │   └── StatusScreen.tsx      # Success / Failed / Timeout UI
│   ├── ThemeProvider.tsx         # next-themes wrapper
│   └── ThemeToggle.tsx           # Dark/Light/System theme dropdown
├── hooks/
│   └── usePaymentFlow.ts         # AbortController, fetch, dispatch
├── public/
├── services/
│   └── paymentService.ts         # fetch wrapper, error classification
├── store/
│   ├── slices/
│   │   └── paymentSlice.ts       # State machine + upsert logic
│   ├── hooks.ts                  # Typed useAppDispatch / useAppSelector
│   ├── provider.tsx              # Provider + StoreHydrator
│   └── store.ts                  # configureStore + localStorage middleware
├── types/
│   ├── index.ts
│   └── payment.ts                # All domain types, no any
├── utils/
│   ├── cardUtils.ts              # BIN detection (Visa/MC/Amex)
│   ├── cn.ts                     # clsx + tailwind-merge helper
│   ├── formatters.ts             # Card spacing, currency, masking
│   ├── idempotency.ts            # generateTransactionId()
│   └── validators.ts             # Luhn, expiry, CVV, amount
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

---

## Architecture Decisions

### Why Redux Toolkit over Zustand

I chose Redux Toolkit because managing a complex payment lifecycle (Idle -> Processing -> Success/Failed/Timeout) requires strict, predictable state transitions. Redux's robust dev-tools allow for time-travel debugging which is crucial for testing complex retry loops and timeout edge cases. Furthermore, writing custom middleware to seamlessly sync the transaction history with localStorage keeps side-effects clean and decoupled from my UI components.

### State machine design

`PaymentStatus` is a strict union type:

```ts
'idle' | 'processing' | 'success' | 'failed' | 'timeout'
```

The UI is entirely derived from this single value — `PaymentPageClient` shows either `<PaymentForm />` or `<StatusScreen />` based on status alone. No boolean flags like `isLoading` or `hasError`. This prevents impossible states (e.g. `isLoading: true` and `hasError: true` simultaneously).

### Why `lastPayload` lives in Redux

On retry, `PaymentForm` is unmounted — its local `useState` is gone. The only way `RetryTracker` can reconstruct the original payload (with the same `transactionId`) is if it was stored in the global store at submission time. Storing it in Redux at `handleSubmit` means retry always has access to the original payload without prop drilling or React context.

### Idempotency

A `transactionId` is generated once via `crypto.randomUUID()` at form submission and stored in Redux via `setLastPayload`. Every retry passes the same ID. The `upsertTransaction` function in the slice finds the existing record by `id` and updates it in place — so the history list never shows duplicate entries for the same payment flow regardless of retry count.

### Timeout handling

The frontend sets a 6-second `AbortController` signal on the fetch call. The mock API intentionally delays 8 seconds for the timeout case — meaning the API response is never received. The `AbortError` is caught separately from network errors and API-returned failures, mapping to three distinct user messages:

| Error type | Cause | User message |
|---|---|---|
| `AbortError` | Frontend cancelled at 6s | "Payment request timed out" |
| Network error | fetch() threw | "Unable to reach payment server" |
| API failure | 400 response | Failure reason from server |

### LocalStorage persistence

A custom Redux middleware saves `transactions` to localStorage after every dispatched action. On mount, `StoreHydrator` reads localStorage and dispatches `loadTransactions` before the first render. A `useRef` guard prevents double hydration in React Strict Mode. The entire persistence layer is ~20 lines with no external dependency.

---

## Payment Flow

User fills form
→ real-time formatting (card spacing, expiry slash, CVV length)
→ per-field validation on blur, error cleared on change
→ submit disabled until all fields valid
Submit
→ generateTransactionId() — stored in Redux
→ dispatch setLastPayload(payload)
→ dispatch setProcessing()
→ fetch('/api/pay') with AbortController (6s signal)
API responds within 6s
→ success (60%) → dispatch setSuccess() → StatusScreen shows success
→ failed  (25%) → dispatch setFailure() → StatusScreen shows failure + RetryTracker
API does not respond within 6s
→ AbortController fires → dispatch setTimeoutStatus() → RetryTracker shown
Retry (max 3 attempts)
→ same transactionId reused
→ attempt number increments
→ history row updated in place (no duplicate)
→ after attempt 3 → retry disabled → "Start New Payment"
New Payment
→ dispatch resetPaymentState()
→ status → 'idle' → PaymentForm re-renders

---

## Validation Rules

| Field | Rules |
|---|---|
| Cardholder name | Required, min 2 chars, letters/spaces/hyphens only |
| Card number | Required, digits only, 15–16 digits, Luhn checksum |
| Expiry | MM/YY format, not in the past |
| CVV | 3 digits (4 for Amex) |
| Amount | Required, positive, max 2 decimal places, max 1,000,000 |

Luhn algorithm is implemented from scratch in `utils/validators.ts` — not regex-based. This correctly rejects syntactically valid but institutionally invalid card numbers.

---

## Card Detection (BIN Ranges)

| Network | Detection |
|---|---|
| Visa | Starts with `4` |
| Mastercard | `51–55` or `2221–2720` (newer BIN range) |
| Amex | Starts with `34` or `37` |

The Mastercard `2221–2720` range is commonly missed in tutorial implementations. CVV length and card number max length both adjust dynamically based on detected card type.

---

## Accessibility

- All inputs have visible `<label>` elements
- Error messages linked via `aria-describedby`
- `StatusScreen` has `role="status"` and `aria-live="polite"` — screen readers announce results without interrupting
- Focus moves programmatically to `StatusScreen` on payment result via `useEffect` + `containerRef.focus()`
- `HistoryItem` uses `role="button"` with `onKeyDown` handler for Enter/Space — keyboard navigable without a native `<button>`
- Submit button disabled during processing — prevents double submission

---

## Responsive Behaviour

- **375px (mobile):** Single column. Form stacks above StatusScreen/History.
- **1280px (desktop):** Two-column layout. Card preview left, form right. History below full width.
- Tested at both breakpoints in Chrome DevTools.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | App Router, SSR, API Routes |
| TypeScript | 5 | Type safety throughout, no `any` |
| Redux Toolkit | 2 | Global state + localStorage middleware |
| Tailwind CSS | 4 | Styling with CSS custom property theming |
| clsx + tailwind-merge | latest | Conditional class composition |

---

## What I'd Improve Given More Time

**Testing**
Unit tests for `validators.ts` (especially the Luhn algorithm and expiry edge cases) and `formatters.ts` using Vitest. Integration tests for the retry flow with mocked fetch.

**Animations**
Framer Motion transitions between `PaymentForm` and `StatusScreen` — the abrupt swap currently feels mechanical. A slide + fade would communicate state change more clearly.

**Real card network logos**
SVG logos for Visa, Mastercard, and Amex instead of text badges on the card preview.

**Toast notifications**
Minor confirmational feedback (e.g. "Transaction ID copied") currently uses a simple `useState` toggle. A lightweight toast would be cleaner at scale.

**Error boundary granularity**
The current `error.tsx` catches all rendering errors. Per-section boundaries (one for the form, one for history) would allow partial recovery instead of full page fallback.

**API validation**
The `/api/pay` route currently trusts the incoming payload without validation. Adding Zod schema validation server-side would make it production-realistic.

---

## Author

Ritik Singh