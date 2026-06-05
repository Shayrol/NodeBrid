'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@/store/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  user: User;
  postId: number;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

export default function PostDeleteModal({
  user,
  postId,
  openModal,
  setOpenModal,
}: Props) {
  const router = useRouter();

  // 게시글 삭제

  const handleDelete = async () => {
    try {
      if (!user) {
        toast.error('로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`http://localhost:8001/post/${postId}/delete`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      setOpenModal(false);

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      router.push('/');
    } catch (error) {
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>

          <AlertDialogDescription>
            삭제된 게시글은 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="bg-card border-t border-none">
          <AlertDialogCancel className="cursor-pointer">취소</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-400 cursor-pointer"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
