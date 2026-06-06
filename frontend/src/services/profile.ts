import { IProfileResponse } from '@/types/profile';

export const getProfile = async (userId: string): Promise<IProfileResponse> => {
  const res = await fetch(`http://localhost:8001/users/${userId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('정보를 가져오지 못했습니다.');
  }

  return res.json();
};
