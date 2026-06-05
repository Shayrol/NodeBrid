'use client';

import { useAuth } from '@/store/auth-context';
import { UserRoundMinus, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';

type Props = {
  userId: number;
  initialIsFollowing?: boolean;
};

export default function FollowButton({ userId, initialIsFollowing }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuth();

  const onToggleFollow = async () => {
    if (user.user === null) {
      return alert('로그인이 필요합니다.');
    }

    if (isLoading) return;
    setIsLoading(true);

    const url = `http://localhost:8001/user/${userId}/follow`;
    // 현재 상태가 팔로우 중이면 DELETE, 아니면 POST
    const method = isFollowing ? 'DELETE' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        // 세션 쿠키(로그인 정보)를 백엔드 서버에 같이 보내기 위해 필수 설정
        credentials: 'include',
      });

      // fetch는 400, 500 에러 코드를 받아도 catch로 가지 않으므로 직접 체크해야 합니다.
      if (!response.ok) {
        throw new Error('네트워크 응답에 문제가 있습니다.');
      }

      // 백엔드에서 res.send("success")로 문자열을 보내므로 text()로 파싱합니다.
      const result = await response.text();

      if (result === 'success') {
        setIsFollowing(!isFollowing); // 상태 토글 (true -> false, false -> true)
      }
    } catch (error) {
      console.error('Follow Error:', error);
      alert('팔로우 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onToggleFollow}
      disabled={isLoading}
      className={`
        flex justify-center items-center gap-1 py-2 px-2 rounded-lg cursor-pointer text-xs
        ${isFollowing ? 'bg-[#dadada] dark:bg-[#6e6e6e]' : 'bg-primary-m text-white'}
      `}
    >
      {isFollowing ? (
        <UserRoundMinus size={16} color="red" />
      ) : (
        <UserRoundPlus size={16} />
      )}

      <p className="text-xs max-sm:hidden">
        {isLoading ? '처리 중...' : isFollowing ? '언팔로우' : '팔로우'}
      </p>
    </button>
  );
}
