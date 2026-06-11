'use client';

import { getUserPosts } from '@/src/services/posts';
import { useQuery } from '@tanstack/react-query';
import { ImageOff, SquarePen, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostDeleteModal from '../../post/[postId]/_components/PostDeleteModal';
import { User } from '@/store/auth-context';
import { Fragment, useState } from 'react';

type SearchParams = {
  page?: string;
  type?: string;
  keyword?: string;
  sort?: string;
};

export default function PostsTab({ user }: { user: User }) {
  const searchParams = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const params: SearchParams = {
    page: searchParams.get('page') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    keyword: searchParams.get('keyword') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const { data } = useQuery({
    queryKey: ['user-posts', user.id, searchParams.toString()],
    queryFn: () => getUserPosts(user.id, params),
  });
  // const userPosts = getUserPosts(userId, params)

  console.log('user posts: ', data);

  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full border border-border rounded-lg p-4">
      {data?.posts.map((el) => (
        <Fragment key={el.id}>
          <div
            key={el.id}
            className="flex w-full gap-2 border border-border rounded-lg"
          >
            <div className="flex w-full gap-2 max-sm:flex-col">
              {/* img */}
              <div>
                {el.img ? (
                  <Image
                    src={`http://localhost:8001${el.img}`}
                    alt="img"
                    width={128}
                    height={80}
                    className="
                      h-auto max-h-20 object-contain overflow-hidden border border-border rounded-lg
                      max-sm:w-xl max-sm:max-h-48
                    "
                    unoptimized
                  />
                ) : (
                  <div
                    className="
                    flex justify-center items-center
                    w-full min-w-32 h-20
                    bg-card-secondary border border-border rounded-lg

                    max-sm:min-w-full
                    max-sm:h-auto
                    max-sm:aspect-[16/8]
                  "
                  >
                    <ImageOff size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* title */}
              <div className="flex flex-col justify-center items-start gap-3 max-sm:p-2">
                <Link href={`/post/${el.id}`} className="hover:underline">
                  <h1 className="text-sm">{el.title}</h1>
                </Link>
                <div className="flex flex-row justify-center items-center gap-2">
                  {el.Hashtags.map((hash) => (
                    <div
                      key={hash.id}
                      className="flex justify-center items-center py-1 px-2 bg-card-secondary border border-border rounded-full"
                    >
                      <p className="text-xs">{hash.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 p-3 max-sm:hidden">
              <Link href={`/post/${el.id}/edit`}>
                <SquarePen size={16} />
              </Link>
              <Trash
                size={16}
                className="text-red-500 cursor-pointer"
                onClick={() => setOpenModal(true)}
              />
            </div>
          </div>
          <PostDeleteModal
            user={user}
            postId={el.id}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </Fragment>
      ))}
    </div>
  );
}
