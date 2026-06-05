'use client';

import SignupForm from '@/app/(auth)/signup/_components/SignupForm';
import Image from 'next/image';
import Link from 'next/link';

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

export default function SignupPage() {
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
            회원가입을 통해 더 많은 기능을 이용해보세요.
          </p>
        </div>

        {/* SNS 회원가입 */}
        <div className="flex flex-col mt-8 gap-2 justify-center w-full">
          <p className="font-semibold text-xs">SNS 회원가입</p>

          <div className="grid grid-cols-3 gap-3">
            {snsList.map((sns) => (
              <a
                key={sns.id}
                // href={`${sns.href}?state=${encodeURIComponent('/profile')}`}
                href={`${sns.href}`}
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
            회원가입에 필요한 기본정보를 입력해주세요.
          </span>

          <div className="h-px flex-1 bg-muted-foreground" />
        </div>

        <SignupForm />
      </div>
    </main>
  );
}
