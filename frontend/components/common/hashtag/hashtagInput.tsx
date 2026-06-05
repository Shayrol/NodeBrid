'use client';

import { KeyboardEvent } from 'react';

interface IHashtags {
  hashtags: string[];
  setHashtags: (tags: string[]) => void;
}

export default function HashtagInput({ hashtags, setHashtags }: IHashtags) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const value = e.currentTarget.value.trim().toLowerCase();

    if (!value) return;

    if (hashtags.includes(value)) {
      e.currentTarget.value = '';
      return;
    }

    setHashtags([...hashtags, value]);
    e.currentTarget.value = '';
  };

  const removeTag = (tag: string) => {
    setHashtags(hashtags.filter((v) => v !== tag));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-1">
          {hashtags.map((tag) => (
            <div
              key={tag}
              className="flex w-fit gap-2 rounded-full bg-card-secondary px-3 py-1 text-xs"
            >
              <span>{tag}</span>

              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="태그 입력 후 Enter"
          onKeyDown={handleKeyDown}
          className="w-full text-xs px-3 py-2 outline-none border border-border rounded-lg bg-card"
        />
      </div>

      {/* <p className="text-sm text-gray-500">Enter를 누르면 태그가 추가됩니다.</p> */}
    </div>
  );
}
