// app/api/pay/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // We parse the body to ensure it's a valid request, even if we mock the outcome.
    const body = await req.json();

    // Generate a random float between 0 and 1
    const roll = Math.random();

    if (roll < 0.60) {
      // 60% Chance: Success (Simulate normal 2-second processing time)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({ status: 'success' }, { status: 200 });

    } else if (roll < 0.85) {
      // 25% Chance: Failure (Simulate normal 2-second processing time)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(
        { status: 'failed', reason: 'Insufficient funds' },
        { status: 400 }
      );

    } else {
      // 15% Chance: Timeout (Simulate an 8-second hung server)
      // Note: The frontend AbortController MUST kill this connection at 6 seconds.
      await new Promise((resolve) => setTimeout(resolve, 8000));
      return NextResponse.json({ status: 'timeout' }, { status: 408 });
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'error', reason: 'Invalid payload' },
      { status: 400 }
    );
  }
}