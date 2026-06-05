'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

type SignupFormValues = {
  userId: string;
  nick: string;
  password: string;
  passwordConfirm: string;
};

export default function SignupForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [nickChecked, setNickChecked] = useState(false);
  const [nickMessage, setNickMessage] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    mode: 'onChange',
  });

  const nick = useWatch({
    control,
    name: 'nick',
  });

  const password = useWatch({
    control,
    name: 'password',
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      if (!nickChecked) {
        setLoginError('닉네임 중복 체크를 해주세요.');
        return;
      }

      const res = await fetch('http://localhost:8001/auth/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.userId.trim(),
          nick: data.nick.trim(),
          password: data.password,
        }),
      });

      const result = await res.json();

      // 이미 가입된 회원
      if (res.status === 409) {
        setLoginError(result.message);
        return;
      }

      if (!res.ok) {
        setLoginError(result.message);
        return;
      }

      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 닉네임 중복 체크
  const handleNickCheck = async () => {
    if (!nick) {
      setNickMessage('닉네임을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8001/auth/check-nick?nick=${nick}`,
      );
      const result = await res.json();

      if (result.available) {
        setNickChecked(true);
        setNickMessage('사용 가능한 닉네임입니다.');
      } else {
        setNickChecked(false);
        setNickMessage('이미 사용 중인 닉네임입니다.');
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
          <p className="font-bold">회원가입 실패</p>
          <p>{loginError}</p>
        </div>
      )}

      {/* 아이디 */}
      <div className="relative flex flex-col gap-1 pb-6">
        <label htmlFor="userId" className="text-xs font-semibold">
          이메일 <span className="text-red-500 font-bold">*</span>
        </label>

        <input
          id="userId"
          type="email"
          placeholder="user@example.com"
          className="border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary border-border bg-card"
          {...register('userId', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: '올바른 이메일 형식이 아닙니다.',
            },
          })}
        />

        {errors.userId && (
          <p className="absolute bottom-1 left-0 text-xs text-red-500">
            {errors.userId.message}
          </p>
        )}
      </div>

      {/* 닉네임 */}
      <div className="relative flex flex-col gap-1 pb-6">
        <label htmlFor="userId" className="text-xs font-semibold">
          닉네임 <span className="text-red-500 font-bold">*</span>
        </label>

        <div className="flex w-full gap-2">
          <input
            id="nick"
            type="text"
            placeholder="닉네임을 입력해주세요."
            className="border rounded-lg w-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary border-border bg-card"
            {...register('nick', {
              required: '닉네임을 입력해주세요.',
              minLength: {
                value: 2,
                message: '최소 2자 이상 입력해주세요.',
              },
              maxLength: {
                value: 16,
                message: '최대 16자까지 가능합니다.',
              },
              onChange: () => {
                setNickChecked(false);
                setNickMessage('');
              },
            })}
          />

          <button
            type="button"
            onClick={handleNickCheck}
            className="
              flex justify-center items-center text-nowrap py-2 px-3 border border-border
              bg-card rounded-lg text-xs hover:bg-card-hover cursor-pointer"
          >
            중복확인
          </button>
        </div>

        {errors.nick && (
          <p className="absolute bottom-1 left-0 text-xs text-red-500">
            {errors.nick.message}
          </p>
        )}

        {nickMessage && (
          <p
            className={`absolute bottom-1 left-0 text-xs ${
              nickChecked ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {nickMessage}
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
            minLength: {
              value: 6,
              message: '최소 6자 이상 입력해주세요.',
            },
            maxLength: {
              value: 20,
              message: '최대 20자까지 가능합니다.',
            },
            pattern: {
              value:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&=*])[A-Za-z\d!@#$%^&=*]{6,20}$/,
              message: '영문, 숫자, 특수문자를 포함한 6~20자여야 합니다.',
            },
          })}
        />

        {errors.password && (
          <p className="absolute bottom-1 left-0 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="relative flex flex-col gap-1 pb-6">
        <label htmlFor="password" className="text-xs font-semibold">
          비밀번호 확인 <span className="text-red-500 font-bold">*</span>
        </label>

        <input
          type="password"
          placeholder="비밀번호 확인"
          className="border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary border-border bg-card"
          {...register('passwordConfirm', {
            required: '비밀번호 확인을 입력해주세요.',
            validate: (value) =>
              value === password || '비밀번호가 일치하지 않습니다.',
          })}
        />

        {errors.passwordConfirm && (
          <p className="absolute bottom-1 left-0 text-xs text-red-500">
            {errors.passwordConfirm.message}
          </p>
        )}
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-m font-semibold text-white rounded-lg py-3 text-sm disabled:opacity-50 cursor-pointer hover:bg-primary-hover"
      >
        {isSubmitting ? '회원가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
