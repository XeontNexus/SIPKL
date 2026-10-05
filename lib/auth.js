import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        // Demo fallback accounts for instant testing without setting up external DB
        const demoAccounts = {
          'admin@smkn1perhentianraja.sch.id': {
            id: 'admin-1',
            email: 'admin@smkn1perhentianraja.sch.id',
            nama: 'Administrator SIPKL',
            role: 'ADMIN',
            profileId: 'admin-1',
          },
          'guru@smkn1perhentianraja.sch.id': {
            id: 'guru-1',
            email: 'guru@smkn1perhentianraja.sch.id',
            nama: 'Drs. H. Hendra Wijaya, M.Pd',
            role: 'GURU',
            profileId: 'guru-1',
          },
          'siswa@smkn1perhentianraja.sch.id': {
            id: 'siswa-1',
            email: 'siswa@smkn1perhentianraja.sch.id',
            nama: 'Ahmad Fauzi',
            role: 'SISWA',
            profileId: 'siswa-1',
          },
          'mitra@smkn1perhentianraja.sch.id': {
            id: 'mitra-1',
            email: 'mitra@smkn1perhentianraja.sch.id',
            nama: 'PT Telkom Indonesia Witel Riau',
            role: 'MITRA',
            profileId: 'mitra-1',
          },
        };

        const demoUser = demoAccounts[credentials.email];
        if (demoUser && credentials.password === 'password123') {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.nama,
            role: demoUser.role,
            profileId: demoUser.profileId,
          };
        }

        try {
          if (prisma) {
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
              include: {
                siswa: true,
                guruPendamping: true,
                mitra: true,
                admin: true,
              },
            });

            if (user) {
              if (!user.isActive) {
                throw new Error('Akun dinonaktifkan, silakan hubungi admin sekolah');
              }

              const isPasswordValid = await bcrypt.compare(
                credentials.password,
                user.password
              );

              if (isPasswordValid) {
                let profileId = null;
                if (user.role === 'SISWA' && user.siswa) profileId = user.siswa.id;
                if (user.role === 'GURU' && user.guruPendamping) profileId = user.guruPendamping.id;
                if (user.role === 'MITRA' && user.mitra) profileId = user.mitra.id;
                if (user.role === 'ADMIN' && user.admin) profileId = user.admin.id;

                return {
                  id: user.id,
                  email: user.email,
                  name: user.nama,
                  role: user.role,
                  profileId: profileId,
                  avatar: user.avatar,
                };
              }
            }
          }
        } catch (dbErr) {
          console.warn('Prisma DB auth check failed, check database connection:', dbErr.message);
        }

        throw new Error('Email atau password tidak sesuai. Coba akun demo atau cek kembali.');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileId = user.profileId;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileId = token.profileId;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'supersecretkey123456789',
};
