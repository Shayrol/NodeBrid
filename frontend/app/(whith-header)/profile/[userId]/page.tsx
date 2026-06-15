'use client';

import FollowButton from '@/components/common/follow/FollowButton';
import { SearchParams } from '@/lib/createQueryString';
import { getFollowers, getFollowings } from '@/src/services/follow';
import { getUserPosts } from '@/src/services/posts';
import { getProfile } from '@/src/services/profile';
import { useAuth } from '@/store/auth-context';
import { useQuery } from '@tanstack/react-query';
import { ImageOff, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UserProfilePage() {
  const { user } = useAuth();

  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId;
  const postsSearchParams: SearchParams = {
    page: searchParams.get('page') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    keyword: searchParams.get('keyword') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const { data: userInfo } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(String(userId)),
  });

  const { data: followers } = useQuery({
    queryKey: ['profile-followers', userId],
    queryFn: () => getFollowers(Number(userId)),
  });

  const { data: followings } = useQuery({
    queryKey: ['profile-followings', userId],
    queryFn: () => getFollowings(Number(userId)),
  });

  const { data: posts } = useQuery({
    queryKey: ['profile-followings', userId, searchParams.toString()],
    queryFn: () => getUserPosts(Number(userId), postsSearchParams),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (title: string) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const isFollowerModal = modalTitle === '팔로워';

  const users = isFollowerModal ? followers : followings;

  const emptyMessage = isFollowerModal
    ? '팔로워가 없습니다.'
    : '팔로잉한 사용자가 없습니다.';

  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      <div className="max-w-4xl mx-auto p-4">
        {/* 1. 상단 프로필 영역 */}
        <section className="flex flex-col md:flex-row items-center gap-8 py-10 border-b">
          <div className="flex justify-center items-center w-26 h-26 md:w-30 md:h-30 rounded-full overflow-hidden bg-card-secondary border">
            <User size={80} className="text-muted-foreground" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">
                {userInfo ? userInfo.nick : 'unknown'}
              </h2>
              {userInfo ? (
                userInfo.id !== user?.id && (
                  <FollowButton
                    userId={Number(userId)}
                    initialIsFollowing={userInfo.isFollowing}
                  />
                )
              ) : (
                <></>
              )}
            </div>

            {/* 2. 통계 지표 영역 */}
            <div className="flex justify-center md:justify-start gap-8 text-sm md:text-base">
              <div className="text-center md:text-left">
                <span className="font-bold">게시물</span> {userInfo?.postCount}
              </div>
              <button
                onClick={() => openModal('팔로워')}
                className="hover:underline decoration-gray-400 cursor-pointer"
              >
                <span className="font-bold">팔로워</span>{' '}
                {userInfo?.followerCount}
              </button>
              <button
                onClick={() => openModal('팔로잉')}
                className="hover:underline decoration-gray-400 cursor-pointer"
              >
                <span className="font-bold">팔로잉</span>{' '}
                {userInfo?.followingCount}
              </button>
            </div>
          </div>
        </section>

        {/* 3. 게시글 리스트 영역 (Grid) */}
        <section className="py-8">
          {posts?.posts.length ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {posts.posts.map((post) => (
                <Link
                  href={`/post/${post.id}`}
                  key={post.id}
                  className="group relative flex justify-center items-center aspect-square bg-card-secondary rounded-sm overflow-hidden cursor-pointer"
                >
                  {post.img ? (
                    <Image
                      src={post.img.replace('/img/', '/api/images/')}
                      alt="post img"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                    />
                  ) : (
                    <ImageOff size={26} />
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20 text-muted-foreground">
              등록된 게시글이 없습니다.
            </div>
          )}
        </section>

        {/* 4. 팔로워/팔로잉 모달 (심플 예시) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg w-full max-w-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-base">{modalTitle}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-red-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-4">
                {/* 유저 리스트 반복 */}
                {users?.length ? (
                  users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between mb-4"
                    >
                      <Link
                        href={`/profile/${u.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-card-secondary border border-border">
                          <User size={26} />
                        </div>
                        <span className="font-medium text-sm">{u.nick}</span>
                      </Link>
                      {user?.id === u.id ? (
                        <></>
                      ) : (
                        <FollowButton
                          userId={u.id}
                          initialIsFollowing={u.isFollowing}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
