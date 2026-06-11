import LoginPageClient from './_components/LoginPageClient';

export const metadata = {
  title: '로그인',
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center w-full pt-20 px-6 pb-14">
      <LoginPageClient />
    </main>
  );
}
