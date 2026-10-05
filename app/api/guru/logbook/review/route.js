import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { logbookId, catatan, status = 'REVIEWED' } = body;

    return NextResponse.json({
      success: true,
      message: 'Logbook berhasil diverifikasi oleh guru pembimbing',
      data: { logbookId, catatan, status },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
