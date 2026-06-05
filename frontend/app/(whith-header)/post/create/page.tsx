'use client';

import PostForm from '../_components/PostForm';

export default function PostCreatePage() {
  return (
    <main className="flex flex-row gap-5 w-full max-w-7xl">
      <PostForm mode="create" />
    </main>
  );
}
