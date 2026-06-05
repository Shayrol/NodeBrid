// 안쓰는 것 임시로 남겨둠

'use client';

import HashtagInput from '@/components/common/hashtag/hashtagInput';
import { useAuth } from '@/store/auth-context';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const { user } = useAuth();

  // 이미지 업로드
  const onChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('img', file);

    const res = await fetch('http://localhost:8001/post/img', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();

    setImagePath(data.url);
  };

  // 게시글 작성
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8001/post/new', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        url: imagePath,
        UserId: user.id,
        hashtags,
      }),
    });

    if (res.ok) {
      alert('게시글 작성 완료');
      setTitle('');
      setContent('');
      setImagePath('');
    }
  };

  console.log('이미지 Url: ', imagePath);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input type="file" accept="image/*" onChange={onChangeImage} />

      {imagePath && (
        <Image
          src={`http://localhost:8001${imagePath}`}
          alt="preview"
          width={100}
          height={100}
        />
      )}

      <HashtagInput hashtags={hashtags} setHashtags={setHashtags} />

      <button type="submit">게시글 작성</button>
    </form>
  );
}
