export function generateTransactionId(): string {
    return `txn_${crypto.randomUUID()}`;
}