import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, catatanAdmin } = body;

    return NextResponse.json({
      success: true,
      message: `Surat berhasil diupdate menjadi ${status}`,
      data: { id, status, catatanAdmin },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
