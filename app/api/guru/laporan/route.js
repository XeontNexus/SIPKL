import { NextResponse } from 'next/server';
import { getAllLaporanGuru } from '@/lib/laporanStore';

export async function GET() {
  const data = getAllLaporanGuru();
  return NextResponse.json(data);
}
