'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeaderLogo() {
  return (
    <div className="flex justify-center items-center">
      <Link
        href={'/'}
        className="max-md:hidden flex justify-center items-center w-28"
        aria-label="로고"
      >
        <Image
          src="/NodeBird_logo_f_d.png"
          alt="logo"
          width={256}
          height={85}
          priority
          className="block dark:hidden h-auto object-contain"
        />
        <Image
          src="/NodeBird_logo_f_w.png"
          alt="logo"
          width={256}
          height={85}
          priority
          className="hidden dark:block h-auto object-contain"
        />
      </Link>
      <Link
        href={'/'}
        className="md:hidden flex justify-center items-center w-28"
        aria-label="로고"
      >
        <Image
          src="/NodeBird_logo.png"
          alt="logo"
          width={256}
          height={85}
          priority
          className="h-auto object-contain"
        />
      </Link>
    </div>
  );
}
