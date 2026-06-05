// services/post.ts

import { createQueryString } from '@/lib/createQueryString';

type SearchParams = {
  page?: string;
  type?: string;
  keyword?: string;
  sort?: string;
};

export const getPosts = async (searchParams: SearchParams, cookie?: string) => {
  const query = createQueryString(searchParams);

  console.log('query: ', query);

  const res = await fetch(`http://localhost:8001/post?${query}`, {
    headers: cookie
      ? {
          Cookie: cookie,
        }
      : undefined,

    credentials: cookie ? undefined : 'include',

    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('게시글 목록 조회 실패');
  }

  return res.json();
};
