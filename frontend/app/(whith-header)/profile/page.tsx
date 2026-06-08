'use client';

import { useAuth } from '@/store/auth-context';
import { useQuery } from '@tanstack/react-query';
import MyInfo from './_components/MyInfo';
import { useSearchParams } from 'next/navigation';
import FollowersTab from './_components/FollowersTab';
import FollowingsTab from './_components/FollowingsTab';
import Link from 'next/link';
import { getProfile } from '@/src/services/profile';
import PostsTab from './_components/PostsTab';

export default function ProfilePage() {
  // const { data } = useQuery({
  //   queryKey: ['follow'],
  //   queryFn: getFollow,
  // });
  // const params = useParams();
  // const userId = params.userId as string;
  const { user } = useAuth();

  const userId = String(user?.id);

  const { data } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId),
  });

  console.log('profile: ', data);

  const searchParams = useSearchParams();

  const tab = searchParams.get('tab') ?? 'posts';

  const tabComponents = {
    posts: {
      label: '게시글',
      component: <PostsTab user={user} />,
    },
    followers: {
      label: '팔로워',
      component: <FollowersTab userId={user?.id} />,
    },
    followings: {
      label: '팔로잉',
      component: <FollowingsTab userId={user?.id} />,
    },
  };

  console.log('data: ', data);

  return (
    <main className="flex flex-col gap-10 w-full max-w-7xl">
      <MyInfo user={user} profile={data} />
      <div className="flex flex-col justify-center items-start gap-2 w-full px-4 sm:flex-row">
        {/* side tab */}
        <div
          className="
          flex flex-col justify-center items-center gap-1 w-full max-w-40 p-1
          border border-border rounded-lg max-sm:max-w-full max-sm:flex-row"
        >
          {Object.entries(tabComponents).map(([key, value]) => (
            <Link
              key={key}
              href={{ query: { tab: key } }}
              className={`
              flex justify-center items-center w-full p-1 rounded-lg hover:bg-card-hover
              ${tab === key ? 'bg-card-hover' : ''}
            `}
            >
              {value.label}
            </Link>
          ))}
        </div>
        {tabComponents[tab as keyof typeof tabComponents]?.component ??
          tabComponents.followers}
      </div>
    </main>
  );
}
