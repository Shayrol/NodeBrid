'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeaderLogo() {
  return (
    <div className="flex justify-center items-center">
      <Link href={'/'} className="hidden md:block">
        <Image
          src="/NodeBird_logo_f_d.png"
          alt="logo"
          width={100}
          height={40}
          priority
          className="block dark:hidden"
        />
        <Image
          src="/NodeBird_logo_f_w.png"
          alt="logo"
          width={100}
          height={40}
          priority
          className="hidden dark:block"
        />
      </Link>
      <Link href={'/'} className="block md:hidden">
        <Image
          src="/NodeBird_logo.png"
          alt="logo"
          width={100}
          height={40}
          priority
          className="min-w-25"
        />
      </Link>
    </div>
  );
}
