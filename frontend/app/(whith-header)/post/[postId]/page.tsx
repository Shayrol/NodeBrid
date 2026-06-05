import { getPost } from '@/src/services/post';
import PostDetail from './_components/PostDetail';

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function PostPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);

  console.log('post: ', post);

  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      <PostDetail initialData={post} />
    </main>
  );
}
