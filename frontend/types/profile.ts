export interface IProfileResponse {
  followerCount: number;
  followingCount: number;
  id: number;
  nick: string;
  postCount: number;
  isFollowing?: boolean;
}
