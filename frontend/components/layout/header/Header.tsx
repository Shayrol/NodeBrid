'use client';

import { usePathname } from 'next/navigation';
import ThemeButton from '../../common/thems/themsButton';
import HeaderLogo from './logo/headerLogo';
import HeaderProfile from './profile/headerProfile';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  nick: string;
  provider: string | null;
  snsId: string | null;
  createdAt: string;
}

export default function Header({ user }: { user: User | null }) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  const isDetailPage = segments.length >= 2;

  return (
    <header
      className="
      sticky top-0 z-30 flex items-center justify-center min-h-16 text-sm text-foreground font-medium 
      border-b border-border bg-card"
    >
      <nav className="flex w-full max-w-7xl items-center justify-between px-4">
        {/* 헤더 로고 이미지 or Back*/}
        {isDetailPage ? (
          <Link href={`/`} aria-label="뒤로 가기" className="cursor-pointer">
            <ChevronLeft size={22} />
          </Link>
        ) : (
          // <button
          //   type="button"
          //   onClick={() => router.push('/')}
          //   aria-label="뒤로 가기"
          //   className="cursor-pointer"
          // >
          //   <ChevronLeft size={22} />
          // </button>
          <HeaderLogo />
        )}

        <div className="flex gap-2">
          <div className="flex justify-center items-center">
            <ThemeButton />
          </div>

          <HeaderProfile user={user} />
        </div>
      </nav>
    </header>
  );
}
