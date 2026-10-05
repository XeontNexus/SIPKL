import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const roleRoutes = {
  ADMIN: '/dashboard/admin',
  GURU: '/dashboard/guru',
  SISWA: '/dashboard/siswa',
  MITRA: '/dashboard/mitra',
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (token) {
      const role = token.role;
      // Prevent cross-role access in dashboard
      if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL(roleRoutes[role] || '/login', req.url));
      }
      if (pathname.startsWith('/dashboard/guru') && role !== 'GURU') {
        return NextResponse.redirect(new URL(roleRoutes[role] || '/login', req.url));
      }
      if (pathname.startsWith('/dashboard/siswa') && role !== 'SISWA') {
        return NextResponse.redirect(new URL(roleRoutes[role] || '/login', req.url));
      }
      if (pathname.startsWith('/dashboard/mitra') && role !== 'MITRA') {
        return NextResponse.redirect(new URL(roleRoutes[role] || '/login', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
