import { IFollow } from '@/types/follow';

export const getFollowers = async (userId: number): Promise<IFollow[]> => {
  const res = await fetch(`http://localhost:8001/users/${userId}/followers`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('팔로우 목록을 가져오지 못했습니다.');
  }

  return res.json();
};

export const getFollowings = async (userId: number): Promise<IFollow[]> => {
  const res = await fetch(`http://localhost:8001/users/${userId}/followings`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('팔로잉 목록을 가져오지 못했습니다.');
  }

  return res.json();
};
