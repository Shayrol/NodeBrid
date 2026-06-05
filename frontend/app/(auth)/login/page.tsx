'use client';

import LoginForm from '@/app/(auth)/login/_components/LoginForm';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const snsList = [
  { id: 1, name: '구글', img: '/logo/google.svg', href: '' },
  {
    id: 2,
    name: '카카오',
    img: '/logo/kakao.svg',
    href: 'http://localhost:8001/auth/kakao',
  },
  { id: 3, name: '네이버', img: '/logo/naver.svg', href: '' },
];

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('state') || '/';

  return (
    <main className="flex flex-col items-center w-full pt-20 px-6 pb-14">
      <div className="flex flex-col items-center w-full max-w-md">
        <Link href="/">
          <Image
            src="/NodeBird_logo_s.png"
            alt="NodeBird Logo"
            width={100}
            height={100}
          />
        </Link>

        <div className="flex flex-col mt-4 justify-center items-center gap-2">
          <h1 className="font-bold text-2xl">
            NodeBird에 오신것을 환영합니다.
          </h1>
          <p className="font-normal text-sm text-center text-muted-foreground">
            로그인을 통해 더 많은 기능을 이용해보세요.
          </p>
        </div>

        {/* SNS 로그인 */}
        <div className="flex flex-col mt-8 gap-2 justify-center w-full">
          <p className="font-semibold text-xs">SNS 로그인</p>

          <div className="grid grid-cols-3 gap-3">
            {snsList.map((sns) => (
              <a
                key={sns.id}
                // href={`${sns.href}?state=${encodeURIComponent('/profile')}`}
                href={`${sns.href}?state=${encodeURIComponent(returnUrl)}`}
                className="
                  flex justify-center items-center px-2 py-2 whitespace-nowrap border rounded-lg
                  border-border bg-card hover:bg-card-hover cursor-pointer
                  "
              >
                <Image
                  src={sns.img}
                  alt={sns.name}
                  width={15}
                  height={15}
                  className="dark:invert"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center w-full gap-4 my-7">
          <div className="h-px flex-1 bg-muted-foreground" />

          <span className="text-sm text-muted-foreground whitespace-nowrap">
            NodeBird 아이디로 로그인
          </span>

          <div className="h-px flex-1 bg-muted-foreground" />
        </div>

        {/* 로컬 로그인 */}
        <LoginForm />

        {/* 회원가입 */}
        <div className="flex justify-center items-center w-full py-6 text-foreground">
          <p className="text-xs font-semibold">
            아직 회원이 아니신가요?{' '}
            <Link href={'/signup'} className="text-primary-m hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
