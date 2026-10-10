import { NextResponse } from 'next/server';
import { updateLogbookReview } from '@/lib/logbookStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { logbookId, catatan, status = 'REVIEWED' } = body;

    const updated = updateLogbookReview(logbookId, catatan, status);

    return NextResponse.json({
      success: true,
      message: 'Logbook berhasil diverifikasi oleh guru pembimbing',
      data: updated || { logbookId, catatan, status },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
