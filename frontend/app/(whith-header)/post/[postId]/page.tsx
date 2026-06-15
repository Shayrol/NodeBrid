import { getPost } from '@/src/services/post';
import PostDetail from './_components/PostDetail';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPost(postId);

  return {
    title: post.post.title,
    description: post.post.content,
  };
}

export default async function PostPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);

  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      <PostDetail initialData={post} />
    </main>
  );
}
