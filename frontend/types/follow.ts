// 팔로우, 팔로잉 유저 정보

export interface IFollow {
  createdAt: string;
  updatedAt: string;
  followingId: number;
  followerId: number;
}

export interface IFollow {
  id: number;
  nick: string;
  isFollowing: boolean;
}

// export interface IFollowResponse {
//   followers: IUserFollow[];
//   followings: IUserFollow[];
// }
