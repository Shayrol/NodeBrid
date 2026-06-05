'use client';

import { getFollow } from '@/src/services/follow';
import { useAuth } from '@/store/auth-context';
import { useQuery } from '@tanstack/react-query';
import MyInfo from './_components/MyInfo';
import { useSearchParams } from 'next/navigation';
import FollowersTab from './_components/FollowersTab';
import FollowingsTab from './_components/FollowingsTab';
import Link from 'next/link';

export default function ProfilePage() {
  const { data } = useQuery({
    queryKey: ['follow'],
    queryFn: getFollow,
  });

  const { user } = useAuth();
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab') ?? 'followers';

  const tabComponents = {
    followers: {
      label: '팔로워',
      component: <FollowersTab follow={data} />,
    },
    followings: {
      label: '팔로잉',
      component: <FollowingsTab follow={data} />,
    },
  };

  const followers = data?.followers.length || 0;
  const followings = data?.followings.length || 0;

  console.log('data: ', data);

  return (
    <main className="flex flex-col gap-10 w-full max-w-7xl">
      <MyInfo user={user} followers={followers} followings={followings} />
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
