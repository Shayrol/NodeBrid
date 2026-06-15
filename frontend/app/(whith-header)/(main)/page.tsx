import PostsList from './_components/PostsList';
import { cookies } from 'next/headers';
import { getPosts } from '@/src/services/posts';
import FloatingWriteButton from '@/components/common/FloatingWriteButton';

interface Props {
  searchParams: {
    page?: string;
    type?: string;
    keyword?: string;
    sort?: string;
  };
}

const cookieStore = await cookies();

const cookie = cookieStore
  .getAll()
  .map((v) => `${v.name}=${v.value}`)
  .join('; ');

export const metadata = {
  title: '홈',
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const posts = await getPosts(params, cookie);

  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      {/* <PostForm /> */}
      {/* <div className="sticky top-21 flex justify-center items-start w-full max-w-60 h-60 border border-border rounded-lg">
        사이드 메뉴
      </div> */}
      <PostsList initialData={posts} />

      <FloatingWriteButton />
    </main>
  );
}

// 프로필 페이지 구현 완료
// 메타데이터 추가 완료
// 1. 프로필 이미지 추가?
// 2. 댓글 추가?
// 3. 실시간 채팅 추가?
// 4. 성능 최적화
