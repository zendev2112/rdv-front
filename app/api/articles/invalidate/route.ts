import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Your invalidate logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Invalidate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
