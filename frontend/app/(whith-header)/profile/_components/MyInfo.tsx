'use client';

import { User as UserType } from '@/store/auth-context';
import { IProfileResponse } from '@/types/profile';
import { User } from 'lucide-react';

type Props = {
  user: UserType;
  profile?: IProfileResponse;
};

export default function MyInfo({ user, profile }: Props) {
  return (
    <div className="flex flex-col justify-start items-center gap-3 w-full px-4 pt-3">
      {/* 기본 정보 + follow */}
      <div className="flex flex-row justify-center items-center gap-4 w-full max-sm:items-start max-sm:flex-col">
        {/* user */}
        <div className="flex gap-2 w-full max-w-60">
          <div className="flex justify-center items-center p-1 rounded-full bg-card-secondary border border-border">
            <User size={36} />
          </div>
          <div className="flex flex-col justify-center items-start min-w-0 flex-1">
            <div className="flex justify-center items-center gap-1">
              <p className="text-sm truncate w-full">{user.nick}</p>
              <p className="text-xs text-foreground">{`(${user.provider})`}</p>
            </div>
            <p className="text-xs truncate w-full">{user.email}</p>
          </div>
        </div>

        {/* post + follow Count */}
        <div className="flex justify-center items-center gap-2 w-full">
          <div className="flex justify-center items-center gap-1 w-full p-2 bg-card border border-border rounded-lg">
            <p className="text-sm">게시글</p>
            <p className="text-sm">{profile?.postCount}</p>
          </div>
          <div className="flex justify-center items-center gap-1 w-full p-2 bg-card border border-border rounded-lg">
            <p className="text-sm">팔로워</p>
            <p className="text-sm">{profile?.followerCount}</p>
          </div>
          <div className="flex justify-center items-center gap-1 w-full p-2 bg-card border border-border rounded-lg">
            <p className="text-sm">팔로잉</p>
            <p className="text-sm">{profile?.followingCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
