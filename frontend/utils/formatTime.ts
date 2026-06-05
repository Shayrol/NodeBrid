export const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const target = new Date(dateString);

  const diff = Math.floor((now.getTime() - target.getTime()) / 1000);

  // 초
  if (diff < 60) {
    return `${diff}초 전`;
  }

  // 분
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  // 시간
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }

  // 일
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}일 전`;
  }

  // 달
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}달 전`;
  }

  // 년
  const years = Math.floor(months / 12);
  return `${years}년 전`;
};
