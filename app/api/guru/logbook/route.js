import { NextResponse } from 'next/server';
import { getLogbooks } from '@/lib/logbookStore';

export async function GET() {
  const data = getLogbooks();
  return NextResponse.json(data);
}
