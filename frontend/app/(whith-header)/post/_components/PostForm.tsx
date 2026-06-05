'use client';

import { IPost } from '@/types/post';
import PostEditor from '../../(main)/_components/PostEditor';
import { useEffect, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import HashtagInput from '@/components/common/hashtag/hashtagInput';
import { useAuth } from '@/store/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  mode: 'create' | 'edit';
  initialData?: {
    post: IPost;
    totalCount: number;
  };
};

type FormValues = {
  title: string;
  content: string;
  UserId: number;
  hashtags: string[];
};

export default function PostForm({ mode, initialData }: Props) {
  const { user } = useAuth();
  const isEdit = mode === 'edit';

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.post.img || null,
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
      UserId: user?.id,
      hashtags: [],
    },
  });

  // 이미지 preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const localUrl = URL.createObjectURL(file);

    setPreview(localUrl);
  };

  // edit 초기값 세팅
  useEffect(() => {
    if (!initialData) return;

    reset({
      title: initialData.post.title,
      content: initialData.post.content,
      UserId: user?.id,
      hashtags: initialData.post.Hashtags?.map((el) => el.title) || [],
    });
  }, [initialData, reset]);

  // 해시태그
  const hashtags = watch('hashtags') || [];

  // submit
  const onSubmit = async (data: FormValues) => {
    console.log('hash tag: ', data.hashtags);

    try {
      let imageUrl = initialData?.post.img || '';

      // 새 이미지 선택한 경우만 업로드
      if (imageFile) {
        const imageFormData = new FormData();

        imageFormData.append('img', imageFile);

        const imageRes = await fetch('http://localhost:8001/post/img', {
          method: 'POST',
          credentials: 'include',
          body: imageFormData,
        });

        const imageData = await imageRes.json();

        imageUrl = imageData.url;
      }

      // 게시글 데이터
      const payload = {
        title: data.title,
        content: data.content,
        hashtags: data.hashtags,
        UserId: user?.id,
        url: imageUrl,
      };

      // 생성 / 수정 분기
      const res = await fetch(
        isEdit
          ? `http://localhost:8001/post/${initialData?.post.id}/update`
          : 'http://localhost:8001/post/new',
        {
          method: isEdit ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const _data = await res.json();

      if (!res.ok) {
        throw new Error(_data.message);
      }

      if (res.ok) {
        toast.success(isEdit ? '게시글 수정 완료' : '게시글 작성 완료');
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center gap-3 w-full pt-3 pb-5 px-4">
      <h1 className="flex justify-start items-center text-foreground text-sm font-bold p-4 w-full max-w-2xl">
        {isEdit ? '게시글 수정' : '게시글 작성'}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center w-full max-w-2xl space-y-5"
      >
        {/* 제목 */}
        <div className="relative flex flex-col justify-center items-start w-full gap-1 pb-5">
          <p className="text-xs text-foreground font-medium flex gap-1">
            제목
            <span className="text-xs text-red-400 font-semibold">∗</span>
          </p>
          <input
            type="text"
            placeholder="제목을 입력하세요."
            {...register('title', {
              required: '제목을 입력하세요.',
            })}
            className="
            w-full rounded-lg border px-3 py-2
            outline-none text-xs bg-card
          "
          />

          {errors.title && (
            <p className="absolute bottom-0 left-0 z-20 text-xs text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 태그 */}
        <div className="flex flex-col justify-center items-start w-full gap-1">
          <p className="text-xs text-foreground font-medium flex gap-1">태그</p>
          <HashtagInput
            hashtags={hashtags}
            setHashtags={(tags) =>
              setValue('hashtags', tags, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        </div>

        {/* 에디터 */}
        <div className="relative flex flex-col justify-center items-start w-full gap-1 pb-5">
          <p className="text-xs text-foreground font-medium flex gap-1">
            내용
            <span className="text-xs text-red-400 font-semibold">∗</span>
          </p>

          <div className="w-full min-h-[430px]">
            <Controller
              control={control}
              name="content"
              rules={{
                validate: (value) => {
                  const text = value
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, '')
                    .trim();

                  return text.length > 0 || '내용을 입력하세요.';
                },
              }}
              render={({ field }) => (
                <PostEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {errors.content && (
            <p className="absolute bottom-0 left-0 z-20 text-xs text-red-500">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* 이미지 */}
        <div className="space-y-3 w-full">
          <label
            className="
              flex h-60 w-full cursor-pointer
              items-center justify-center
              rounded-2xl border-2 border-dashed
              border-gray-300
              hover:bg-gray-50
              dark:border-gray-700
              dark:hover:bg-gray-900
            "
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {preview ? (
              <div className="relative h-full w-full">
                <Image
                  src={isEdit ? `http://localhost:8001${preview}` : preview}
                  alt="preview"
                  fill
                  className="rounded-lg object-contain object-center"
                  unoptimized
                />

                <div
                  className="
                    absolute inset-0
                    flex items-center justify-center
                    rounded-2xl
                    bg-black/40 opacity-0
                    transition hover:opacity-100
                  "
                >
                  <p className="text-sm text-white">이미지 변경</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium">이미지 업로드</p>

                <p className="text-xs text-gray-500">클릭해서 이미지 추가</p>
              </div>
            )}
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end items-center w-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
          rounded-lg px-5 py-2 max-sm:w-full
          text-white bg-black dark:text-black dark:bg-white
        "
          >
            {isEdit ? '수정하기' : '작성하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
