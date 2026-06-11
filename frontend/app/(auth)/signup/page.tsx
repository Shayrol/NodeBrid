import SignupPageClient from './_components/SignupPageClient';

export const metadata = {
  title: '회원가입',
};

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center w-full pt-20 px-6 pb-14">
      <SignupPageClient />
    </main>
  );
}
