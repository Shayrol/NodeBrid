'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { User } from 'lucide-react';

interface User {
  id: number;
  email: string;
  nick: string;
  provider: string | null;
  snsId: string | null;
  createdAt: string;
}

export default function HeaderProfile({ user }: { user: User | null }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch('http://localhost:8001/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();

    // 백에서 res.redirect로 이동을 하면 fetch 요청을 못하며 메인 페이지로 이동을 못함
    // 소셜 자체 로그아웃을 하면 CORS 문제로 백에서는 json으로 로그아웃 성공 여부와
    // 리다이렉트 URL을 프론트로 전달하고 프론트에서 리다이렉트 URL로 이동하는 방식으로 로그아웃 구현
    // window.location.href를 통해 해당 url로 이동하면서 로그아웃 처리
    window.location.href = data.redirectUrl;
  };

  if (!user) {
    return (
      <div className="flex flex-row gap-2 justify-center items-center">
        <Link
          href={`/login?state=${encodeURIComponent(pathname)}`}
          className="
                flex justify-center items-center text-xs border border-border p-2 rounded-lg bg-card-secondary
                hover:bg-card-hover"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="
                flex justify-center items-center text-xs text-white border border-primary-m p-2 rounded-lg 
                bg-primary-m hover:bg-primary-hover"
        >
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex justify-center items-center p-2 rounded-lg border border-border bg-card cursor-pointer">
          <User className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-card border border-border flex flex-col gap-1"
      >
        <div className="flex justify-center items-center w-full py-1 border-b border-border">
          <p className="text-xs font-bold">{user.nick}</p>
        </div>
        <DropdownMenuItem className="hover:bg-card-hover cursor-pointer">
          {' '}
          <Link
            href="/profile"
            className="flex justify-center items-center text-xs w-full cursor-pointer"
          >
            내 정보
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-card-hover cursor-pointer">
          {' '}
          <button
            onClick={handleLogout}
            // className="
            //   flex justify-center items-center text-xs text-white border border-primary py-1 px-2 rounded-lg bg-primary
            //     hover:bg-primary-hover cursor-pointer"
            className="flex justify-center items-center text-xs w-full cursor-pointer"
          >
            로그아웃
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
