// app/(main)/layout.tsx

import Header from '@/components/layout/header/Header';
import { AuthProvider } from '@/store/auth-context';
import { cookies } from 'next/headers';

async function getUser() {
  const cookieStore = await cookies();

  try {
    const res = await fetch('http://localhost:8001/me', {
      headers: { Cookie: cookieStore.toString() }, // 서버 측에서 쿠키 전달
      cache: 'no-store', // 유저 정보는 캐싱 방지
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <AuthProvider initialUser={user}>
      <div className="flex flex-col w-full mx-auto">
        <Header user={user} />
        <main className="flex justify-center w-full">{children}</main>
      </div>
    </AuthProvider>
  );
}
