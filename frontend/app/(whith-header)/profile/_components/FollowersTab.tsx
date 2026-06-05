'use client';

import FollowButton from '@/components/common/follow/FollowButton';
import { IFollowResponse } from '@/types/follow';
import { User } from 'lucide-react';

type Props = {
  follow?: IFollowResponse;
};

// const mockFollowings = [
//   { id: 1, nick: '초무', isFollowing: false },
//   { id: 2, nick: '홍길동', isFollowing: true },
//   { id: 3, nick: '김철수', isFollowing: true },
//   { id: 4, nick: '이영희', isFollowing: true },
//   { id: 5, nick: '박민수', isFollowing: true },
//   { id: 6, nick: '최유진', isFollowing: true },
//   { id: 7, nick: '정하늘', isFollowing: true },
//   { id: 8, nick: '강지훈', isFollowing: true },
//   { id: 9, nick: '윤서연', isFollowing: true },
//   { id: 10, nick: '한지민', isFollowing: true },
//   { id: 11, nick: '오세훈', isFollowing: true },
//   { id: 12, nick: '신예린', isFollowing: true },
//   { id: 13, nick: '장도현', isFollowing: true },
//   { id: 14, nick: '문서준', isFollowing: true },
//   { id: 15, nick: '조민재', isFollowing: true },
//   { id: 16, nick: '백수진', isFollowing: true },
//   { id: 17, nick: '유지호', isFollowing: true },
//   { id: 18, nick: '노지우', isFollowing: true },
//   { id: 19, nick: '임태성', isFollowing: true },
//   { id: 20, nick: '서가은', isFollowing: true },
// ];

export default function FollowersTab({ follow }: Props) {
  const followers = follow?.followers;
  // const followers = mockFollowings;

  return (
    <div className="flex flex-col justify-center items-center w-full border border-border rounded-lg p-4">
      {followers?.length !== 0 ? (
        <div className="flex flex-col gap-4 w-full h-96 overflow-y-auto md:grid md:grid-cols-2">
          {followers?.map((el) => (
            <div
              key={el.id}
              className="flex justify-between items-center p-3 h-fit border border-border rounded-lg"
            >
              <div className="flex justify-center items-center gap-2 min-w-0">
                <div className="flex justify-center items-center p-1 rounded-full border border-border bg-card-secondary">
                  <User size={16} />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {el.nick}
                </p>
              </div>

              <FollowButton
                userId={el.id}
                initialIsFollowing={el.isFollowing}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-96">
          <p className="text-sm font-semibold text-muted-foreground">
            아직 팔로워가 없습니다.
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            게시글을 작성하고 팔로워를 모아보세요.
          </p>
        </div>
      )}
    </div>
  );
}
