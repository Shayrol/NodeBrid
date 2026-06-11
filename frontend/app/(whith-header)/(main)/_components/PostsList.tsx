'use client';

import { formatTimeAgo } from '@/utils/formatTime';
import { Heart, User } from 'lucide-react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { IPost, IPostsResponse } from '@/types/post';
import { useAuth } from '@/store/auth-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchForm from './SearchForm';
import { useState } from 'react';
import Link from 'next/link';

// 백엔드 API 요청 함수들
const fetchLikedPosts = async () => {
  const res = await fetch('http://localhost:8001/post/liked/me', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('좋아요 목록을 가져오지 못했습니다.');
  return res.json(); // 예시 반환 형태: [1, 5, 12] (내가 좋아요 누른 ID 배열)
};

const toggleLikePost = async (postId: number) => {
  const res = await fetch(`http://localhost:8001/post/${postId}/like`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('좋아요 처리에 실패했습니다.');
  return res.json();
};

export default function PostsList({
  initialData,
}: {
  initialData: IPostsResponse;
}) {
  console.log('posts: ', initialData);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  // 게시글 좋아요 카운트 업데이트
  const [optimisticLikeCounts, setOptimisticLikeCounts] = useState<
    Record<number, number>
  >({});

  const posts = initialData;

  // 1. 내가 좋아요 누른 게시글 ID 배열 가져오기 (로그인 시에만 활성화)
  const { data: likedPostIds = [] } = useQuery<number[]>({
    queryKey: ['likedPosts', user?.id],
    queryFn: fetchLikedPosts,
    enabled: !!user, // 로그인한 유저가 있을 때만 이 API를 트리거함
  });

  // 2. 좋아요 누르기 Mutation (낙관적 업데이트 적용)
  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    // [낙관적 업데이트] 온클릭 즉시 실행되는 함수
    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: ['likedPosts', user?.id],
      });

      const previousLikedIds = queryClient.getQueryData<number[]>([
        'likedPosts',
        user?.id,
      ]);

      queryClient.setQueryData<number[]>(
        ['likedPosts', user?.id],
        (old = []) => {
          return old.includes(postId)
            ? old.filter((id) => id !== postId)
            : [...old, postId];
        },
      );

      // likeCount 낙관적 업데이트
      setOptimisticLikeCounts((prev) => {
        const isLiked = previousLikedIds?.includes(postId);

        const targetPost = posts.posts.find((post) => post.id === postId);

        const currentCount = prev[postId] ?? targetPost?.likeCount ?? 0;

        return {
          ...prev,
          [postId]: isLiked ? currentCount - 1 : currentCount + 1,
        };
      });

      return { previousLikedIds };
    },
    // 에러 발생 시 원래 상태로 롤백
    onError: (err, postId, context) => {
      if (context?.previousLikedIds) {
        queryClient.setQueryData(
          ['likedPosts', user?.id],
          context.previousLikedIds,
        );
      }

      // 원래 값으로 복구
      setOptimisticLikeCounts((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
    },
    // 성공하든 실패하든 백엔드와 최종 싱크를 맞추기 위해 무효화(Refetch)
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['likedPosts', user?.id],
      });
    },
  });

  const onLikePost = (el: IPost) => {
    if (!user) {
      return alert('로그인 후 이용가능합니다.');
    }
    // Mutation 실행
    likeMutation.mutate(el.id);
  };

  return (
    <div className="flex flex-col justify-start items-center gap-3 w-full pb-5 px-4">
      <SearchForm />

      {posts.posts?.map((el) => {
        // 현재 게시글 ID가 내가 좋아요 누른 배열에 포함되어 있는지 확인
        const isLiked = likedPostIds.includes(el.id);
        const currentLikeCount = optimisticLikeCounts[el.id] ?? el.likeCount;

        return (
          <div
            key={el.id}
            className="flex flex-col justify-center items-center p-3 gap-3 w-full max-w-2xl bg-card border border-border rounded-lg"
          >
            {/* 작성자 정보 */}
            <Link
              href={`/profile/${el.User.id}`}
              className="flex justify-between items-center w-full"
            >
              <div className="flex gap-2 justify-center items-center">
                <User className="rounded-full border border-border bg-card-secondary text-muted-foreground" />

                <div className="flex flex-col">
                  <div className="flex justify-start items-center gap-1">
                    <p className="text-xs font-semibold">{el.User.nick}</p>

                    {user?.id === el.User.id && (
                      <p className="text-xs font-semibold text-muted-foreground">
                        (작성자)
                      </p>
                    )}
                  </div>

                  <p className="text-[9px] text-muted-foreground">
                    @{el.User.email.slice(0, 4)}∗∗∗
                  </p>
                </div>
              </div>

              <p
                className="text-xs text-muted-foreground"
                suppressHydrationWarning
              >
                {formatTimeAgo(el.createdAt)}
              </p>
            </Link>

            {/* 게시글 영역 */}
            <Link
              href={`/post/${el.id}`}
              className="flex flex-col justify-center items-center w-full gap-3"
            >
              <div className="flex flex-col w-full gap-2">
                <h2 className="text-sm font-bold">{el.title}</h2>

                {el.img && (
                  <div className="flex justify-center items-center w-full bg-card-hover rounded-lg border border-border overflow-hidden">
                    <Image
                      src={`http://localhost:8001${el.img}`}
                      alt="preview"
                      width={1200}
                      height={800}
                      className="w-full h-auto max-h-52 object-contain"
                      unoptimized
                    />
                  </div>
                )}

                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(el.content),
                  }}
                  className="text-xs font-medium text-foreground"
                />
              </div>

              {el.Hashtags.length > 0 && (
                <div className="flex items-center gap-2 w-full">
                  {el.Hashtags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-center py-1 px-2 rounded-lg border-border bg-card-secondary"
                    >
                      <p className="text-xs text-muted-foreground">
                        {tag.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Link>

            {/* 하단 옵션 */}

            <div className="flex justify-between w-full">
              {/* 좋아요 */}
              <div className="flex gap-1">
                <button
                  className="transition-transform duration-150 active:scale-90 cursor-pointer"
                  onClick={() => onLikePost(el)}
                >
                  <Heart
                    className={`${isLiked ? 'fill-red-400 text-red-500' : 'text-muted-foreground'} size-4`}
                  />
                </button>
                <p className="text-foreground text-sm">{currentLikeCount}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
