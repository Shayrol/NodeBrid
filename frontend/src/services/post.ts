import { IPostResponse } from '@/types/post';
import { cookies } from 'next/headers';

export const getPost = async (postId: string): Promise<IPostResponse> => {
  const cookieStore = await cookies();

  const res = await fetch(`http://localhost:8001/post/${postId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  });

  return res.json();
};
