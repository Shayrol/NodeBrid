'use client';

import { useAuth } from '@/store/auth-context';
import { IPost, IPostResponse } from '@/types/post';
import { Heart, User } from 'lucide-react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FollowButton from '../../../../../components/common/follow/FollowButton';
import PostActions from './PostActions';
import Link from 'next/link';

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

export default function PostDetail({
  initialData,
}: {
  initialData: IPostResponse;
}) {
  const { user } = useAuth();
  const post = initialData;
  const queryClient = useQueryClient();
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);

  // 1. 내가 좋아요 누른 게시글 ID 배열 가져오기 (로그인 시에만 활성화)
  const { data: likedPostIds = [] } = useQuery<number[]>({
    queryKey: ['likedPosts', user?.id],
    queryFn: fetchLikedPosts,
    enabled: !!user, // 로그인한 유저가 있을 때만 이 API를 트리거함
  });

  const likeMutation = useMutation({
    mutationFn: toggleLikePost,

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

      const wasLiked = previousLikedIds?.includes(postId);

      setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

      return {
        previousLikedIds,
        previousLikeCount: likeCount,
      };
    },

    onError: (_, __, context) => {
      if (context?.previousLikedIds) {
        queryClient.setQueryData(
          ['likedPosts', user?.id],
          context.previousLikedIds,
        );
      }

      if (context?.previousLikeCount !== undefined) {
        setLikeCount(context.previousLikeCount);
      }
    },

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

  // const isLiked = true;
  const isLiked = likedPostIds.includes(post.post?.id);

  return (
    <div className="flex flex-col justify-start items-center gap-3 w-full px-4 pt-3">
      <div className="flex flex-col justify-center items-center p-3 gap-3 w-full max-w-2xl bg-card border border-border rounded-lg">
        <div className="flex justify-between items-center w-full">
          <Link
            href={`/profile/${post.post.UserId}`}
            className="flex gap-2 justify-center items-center"
          >
            <User className="rounded-full border border-border bg-card-secondary text-muted-foreground" />
            <div className="flex flex-col">
              <div className="flex justify-start items-center gap-1">
                <p className="text-xs font-semibold">{post.post.User.nick}</p>
                {user?.id === post.post.User.id && (
                  <p className="text-xs font-semibold text-muted-foreground">
                    (작성자)
                  </p>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground">
                @{post.post.User.email.slice(0, 4)}∗∗∗
              </p>
            </div>
          </Link>

          {user?.id !== post.post.User.id ? (
            <FollowButton
              userId={post.post.User.id}
              initialIsFollowing={post.isFollowing}
            />
          ) : (
            <PostActions user={user} postId={post.post.id} />
          )}

          {/* <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {formatTimeAgo(post.post.createdAt)}
          </p> */}
        </div>

        {/* 게시글 내용 */}
        <div className="flex flex-col w-full gap-2">
          <h2 className="text-sm font-bold">{post.post.title}</h2>

          {post.post.img && (
            <div className="flex justify-center items-center w-full bg-card-hover rounded-lg border border-border overflow-hidden">
              <Image
                src={post.post.img.replace('/img/', '/api/images/')}
                alt="preview"
                width={1200}
                height={800}
                className="w-full h-auto max-h-52 object-contain"
              />
            </div>
          )}

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.post.content),
            }}
            className="text-xs font-medium text-foreground"
          />
        </div>

        {/* tag */}
        {post.post.Hashtags.length !== 0 ? (
          <div className="flex items-center gap-2 w-full">
            {post.post?.Hashtags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-center py-1 px-2 rounded-lg border-border bg-card-secondary"
              >
                <p className="text-xs text-muted-foreground">{tag.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {/* 하단 옵션 구역 */}
        <div className="flex justify-between w-full">
          {/* 좋아요 */}
          <div className="flex gap-1">
            <button
              className="transition-transform duration-150 active:scale-90 cursor-pointer"
              onClick={() => onLikePost(post.post)}
            >
              <Heart
                className={`${isLiked ? 'fill-red-400 text-red-500' : 'text-muted-foreground'} size-4`}
              />
            </button>
            <p className="text-foreground text-sm">{likeCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
