'use client';

import FollowButton from '@/components/common/follow/FollowButton';
import { IFollowResponse } from '@/types/follow';
import { User } from 'lucide-react';

type Props = {
  follow?: IFollowResponse;
};

export default function FollowingsTab({ follow }: Props) {
  const followings = follow?.followings;

  return (
    <div className="flex flex-col justify-center items-center w-full border border-border rounded-lg p-4">
      {followings?.length !== 0 ? (
        <div className="flex flex-col gap-4 w-full h-96 overflow-y-auto md:grid md:grid-cols-2">
          {followings?.map((el) => (
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
            아직 팔로잉이 없습니다.
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            게시글을 작성하고 팔로워를 모아보세요.
          </p>
        </div>
      )}
    </div>
  );
}
