import { IFollowResponse } from '@/types/follow';

export const getFollow = async (): Promise<IFollowResponse> => {
  const res = await fetch('http://localhost:8001/user/follow', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('팔로우 목록을 가져오지 못했습니다.');
  }

  return res.json();
};
