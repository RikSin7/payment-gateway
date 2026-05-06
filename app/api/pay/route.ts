import { NextResponse } from 'next/server';

const FAILURE_REASONS = [
  'Insufficient funds',
  'Card declined',
  'Bank rejected transaction',
  'Payment network unavailable',
  'Suspicious activity detected',
];

function randomDelay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function POST() {
  /**
   * RANDOM DISTRIBUTION
   *
   * 0.00 - 0.59 => success (60%)
   * 0.60 - 0.84 => failed (25%)
   * 0.85 - 1.00 => timeout simulation (15%)
   */

  const rand = Math.random();

  /**
   * TIMEOUT CASE
   * Intentionally delay response beyond frontend abort time.
   */
  if (rand >= 0.85) {
    await randomDelay(8000);

    return NextResponse.json({
      success: false,
      status: 'failed',
      failureReason: 'Gateway timeout',
    });
  }

  /**
   * Simulate realistic processing delay
   */
  await randomDelay(2000);

  /**
   * FAILURE CASE
   */
  if (rand >= 0.60) {
    const randomReason =
      FAILURE_REASONS[
      Math.floor(Math.random() * FAILURE_REASONS.length)
      ];

    return NextResponse.json(
      {
        success: false,
        status: 'failed',
        failureReason: randomReason,
      },
      { status: 400 }
    );
  }

  /**
   * SUCCESS CASE
   */
  return NextResponse.json({
    success: true,
    status: 'success',
  });
}