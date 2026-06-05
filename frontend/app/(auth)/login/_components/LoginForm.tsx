'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginFormValues = {
  userId: string;
  password: string;
};

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('state') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch('http://localhost:8001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.userId,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setLoginError(result.message);
        return;
      }

      if (res.ok) {
        router.replace(returnUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 w-full"
    >
      {loginError && (
        <div className="flex flex-col gap-2 p-3 mb-4 text-xs text-red-400 border border-red-400 rounded-lg">
          <p className="font-bold">로그인 실패</p>
          <p>{loginError}</p>
        </div>
      )}

      {/* 아이디 */}
      <div className="relative flex flex-col gap-1 pb-6">
        <label htmlFor="userId" className="text-xs font-semibold">
          아이디 <span className="text-red-500 font-bold">*</span>
        </label>

        <input
          id="userId"
          type="text"
          placeholder="아이디를 입력해주세요."
          className="border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary border-border bg-card"
          {...register('userId', {
            required: '아이디를 입력해주세요.',
            // minLength: {
            //   value: 4,
            //   message: '아이디는 4자 이상입니다.',
            // },
          })}
        />

        {errors.userId && (
          <p className="absolute bottom-1 left-0 text-xs text-red-500">
            {errors.userId.message}
          </p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="relative flex flex-col gap-1 pb-6">
        <label htmlFor="password" className="text-xs font-semibold">
          비밀번호 <span className="text-red-500 font-bold">*</span>
        </label>

        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          className="border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary border-border bg-card"
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            // minLength: {
            //   value: 6,
            //   message: '비밀번호는 6자 이상입니다.',
            // },
          })}
        />

        {errors.password && (
          <p className="absolute bottom-1 left-0 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-m font-semibold text-white rounded-lg py-3 text-sm disabled:opacity-50 cursor-pointer hover:bg-primary-hover"
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
