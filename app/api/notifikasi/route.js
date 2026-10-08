import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getNotificationsByRole,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/lib/notificationStore';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const role = session?.user?.role || searchParams.get('role') || 'siswa';
    const userId = session?.user?.id || searchParams.get('userId') || (role === 'siswa' ? 'siswa-1' : 'mitra-1');

    const notifications = getNotificationsByRole(role, userId);
    const unreadCount = getUnreadCount(role, userId);

    return NextResponse.json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { action, notificationId } = body;

    const role = session?.user?.role || 'siswa';
    const userId = session?.user?.id || (role === 'siswa' ? 'siswa-1' : 'mitra-1');

    if (action === 'MARK_READ') {
      const notif = markAsRead(notificationId);
      return NextResponse.json({ success: true, data: notif });
    }

    if (action === 'MARK_ALL_READ') {
      markAllAsRead(role, userId);
      return NextResponse.json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca' });
    }

    return NextResponse.json({ success: false, message: 'Action tidak dikenal' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
