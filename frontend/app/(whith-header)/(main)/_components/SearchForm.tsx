'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get('type') || 'title');

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const onSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', '1');

    if (type) {
      params.set('type', type);
    }

    if (keyword) {
      params.set('keyword', keyword);
    } else {
      params.delete('keyword');
    }

    router.push(`?${params.toString()}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="sticky top-16 z-20 flex justify-center items-center w-full bg-background pt-3 pb-2">
      <div className="flex justify-center items-center w-full max-w-2xl gap-2">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger
            className="
              w-28
              text-xs
              focus:ring-0
              focus:ring-offset-0
              focus-visible:ring-0
              focus-visible:ring-offset-0
              focus:outline-none
            "
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            sideOffset={4}
            className="w-full max-w-28 p-1"
          >
            <SelectItem value="title" className="text-xs p-2">
              제목
            </SelectItem>
            <SelectItem value="content" className="text-xs p-2">
              내용
            </SelectItem>
            <SelectItem value="author" className="text-xs p-2">
              작성자
            </SelectItem>
            <SelectItem value="tag" className="text-xs p-2">
              태그
            </SelectItem>
          </SelectContent>
        </Select>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="검색어 입력"
          className="flex-1 border border-border rounded-lg h-8 py-2 px-2 text-xs focus:outline-none"
        />

        <button
          onClick={onSearch}
          className="flex items-center justify-center gap-1 rounded-lg border border-border h-8 p-2 text-xs text-nowrap"
        >
          <Search className="size-3" />
          검색
        </button>
      </div>
    </div>
  );
}
