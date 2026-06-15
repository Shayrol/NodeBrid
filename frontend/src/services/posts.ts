// services/post.ts

import { createQueryString } from '@/lib/createQueryString';
import { IPostsResponse } from '@/types/post';

type SearchParams = {
  page?: string;
  type?: string;
  keyword?: string;
  sort?: string;
};

// 게시글 목록
export const getPosts = async (searchParams: SearchParams, cookie?: string) => {
  const query = createQueryString(searchParams);

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

// 프로필 유저 게시글 목록
export const getUserPosts = async (
  userId: number,
  searchparams: SearchParams,
): Promise<IPostsResponse> => {
  const query = createQueryString(searchparams);

  const res = await fetch(
    `http://localhost:8001/users/${userId}/posts?${query}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error('유저 게시글 목록 조회 실패');
  }

  return res.json();
};
