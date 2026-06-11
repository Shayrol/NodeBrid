import { getPost } from '@/src/services/post';
import PostForm from '../../_components/PostForm';

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export const metadata = {
  title: '게시글 수정',
};

export default async function PostEditPage({ params }: Props) {
  const { postId } = await params;
  const res = await getPost(postId);
  const post = res.post;

  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      <PostForm mode="edit" initialData={post} />
    </main>
  );
}
