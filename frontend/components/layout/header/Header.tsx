'use client';

import { usePathname, useRouter } from 'next/navigation';
import ThemeButton from '../../common/thems/themsButton';
import HeaderLogo from './logo/headerLogo';
import HeaderProfile from './profile/headerProfile';
import { ChevronLeft } from 'lucide-react';

interface User {
  id: number;
  email: string;
  nick: string;
  provider: string | null;
  snsId: string | null;
  createdAt: string;
}

export default function Header({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();

  // const handleBack = () => {
  //   if (window.history.length > 1) {
  //     router.back();
  //   } else {
  //     router.push('/');
  //   }
  // };

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
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="뒤로 가기"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <HeaderLogo />
        )}

        {/* <div className="flex gap-4 justify-center items-center max-sm:hidden">
          <div className="flex gap-4 justify-center items-center text-xs font-semibold w-full">
            <p className="hover:underline cursor-pointer">Q&A</p>
            <p className="hover:underline cursor-pointer">지식</p>
            <p className="hover:underline cursor-pointer">커뮤니티</p>
            <p className="hover:underline cursor-pointer">이벤트</p>
          </div>
        </div> */}

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
