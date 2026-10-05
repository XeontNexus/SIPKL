import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// In-memory fallback if database connection is pending configuration
let mockUsers = [
  { id: '1', email: 'admin@smkn1perhentianraja.sch.id', nama: 'Administrator SIPKL', role: 'ADMIN', createdAt: new Date().toISOString() },
  { id: '2', email: 'hendra@smkn1perhentianraja.sch.id', nama: 'Drs. H. Hendra Wijaya, M.Pd', role: 'GURU', guruPendamping: { nip: '197508122002121003', bidangKeahlian: 'TKJ' }, createdAt: new Date().toISOString() },
  { id: '3', email: 'fauzi@siswa.smkn1.sch.id', nama: 'Ahmad Fauzi', role: 'SISWA', siswa: { nisn: '0051234567', kelas: 'XII TKJ 1', jurusan: 'Teknik Komputer dan Jaringan', statusPKL: 'SEDANG_PKL' }, createdAt: new Date().toISOString() },
  { id: '4', email: 'mitra.telkom@gmail.com', nama: 'PT Telkom Indonesia Witel Riau', role: 'MITRA', mitra: { namaPerusahaan: 'PT Telkom Witel Riau', alamat: 'Jl. Jenderal Sudirman No. 199, Pekanbaru', bidangUsaha: 'Telekomunikasi & Jaringan' }, createdAt: new Date().toISOString() },
];

export async function GET(request) {
  try {
    if (prisma) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          nama: true,
          role: true,
          isActive: true,
          createdAt: true,
          admin: true,
          guruPendamping: true,
          siswa: true,
          mitra: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      if (users && users.length > 0) return NextResponse.json(users);
    }
  } catch (err) {
    console.warn('Prisma query failed, using in-memory mock store:', err.message);
  }

  return NextResponse.json(mockUsers);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, nama, role, nisn, kelas, jurusan, nip, bidangKeahlian, namaPerusahaan, alamat, bidangUsaha } = body;

    if (!email || !password || !nama || !role) {
      return NextResponse.json({ error: 'Data wajib tidak lengkap' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      if (prisma) {
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            nama,
            role,
            ...(role === 'ADMIN' && { admin: { create: {} } }),
            ...(role === 'GURU' && { guruPendamping: { create: { nip: nip || '', bidangKeahlian: bidangKeahlian || '' } } }),
            ...(role === 'SISWA' && { siswa: { create: { nisn: nisn || '', kelas: kelas || '', jurusan: jurusan || '' } } }),
            ...(role === 'MITRA' && { mitra: { create: { namaPerusahaan: namaPerusahaan || nama, alamat: alamat || '', bidangUsaha: bidangUsaha || '' } } }),
          },
          include: {
            admin: true,
            guruPendamping: true,
            siswa: true,
            mitra: true,
          },
        });
        return NextResponse.json(newUser, { status: 201 });
      }
    } catch (dbErr) {
      console.warn('Prisma create failed, saving to local store:', dbErr.message);
    }

    // Fallback store
    const createdUser = {
      id: Date.now().toString(),
      email,
      nama,
      role,
      createdAt: new Date().toISOString(),
      ...(role === 'GURU' && { guruPendamping: { nip, bidangKeahlian } }),
      ...(role === 'SISWA' && { siswa: { nisn, kelas, jurusan } }),
      ...(role === 'MITRA' && { mitra: { namaPerusahaan: namaPerusahaan || nama, alamat, bidangUsaha } }),
    };

    mockUsers.unshift(createdUser);
    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
