// 메인 페이지 게시글 작성 오른쪽 하단 버튼
'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';

export default function FloatingWriteButton() {
  return (
    <Link
      href="/post/create"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3
       bg-black dark:bg-white text-white dark:text-black
      shadow-lg hover:scale-105 transition
      "
    >
      <Pencil size={18} />
      <p className="max-sm:hidden">작성</p>
    </Link>
  );
}
