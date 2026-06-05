'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/store/auth-context';
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import PostDeleteModal from './PostDeleteModal';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  user: User;
  postId: number;
};

export default function PostActions({ user, postId }: Props) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <button>
            <EllipsisVertical size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-card border border-border flex flex-col gap-1"
        >
          <DropdownMenuItem className="cursor-pointer">
            <SquarePen size={16} />
            <Link
              href={`/post/${postId}/edit`}
              className="flex justify-start w-full items-center text-xs cursor-pointer"
            >
              수정
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <Trash2 size={16} />
            <button className="flex justify-center items-center text-xs cursor-pointer">
              삭제
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PostDeleteModal
        user={user}
        postId={postId}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
}
