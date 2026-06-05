export interface IUser {
  id: number;
  nick: string;
  provider: string;
  email: string;
  isFollowing: boolean;
}

interface ILikers {
  id: number;
  PostLike: {
    createdAt: string;
    updatedAt: string;
    userId: number;
    postId: number;
  };
}

interface IHashtags {
  id: number;
  title: string;
}

export interface IPost {
  id: number;
  title?: string;
  content: string;
  img?: string;

  likeCount: number;
  isLiked: boolean;

  createdAt: string;
  updatedAt: string;

  User: IUser;
  UserId: number;
  Likers: ILikers[];
  Hashtags: IHashtags[];
}

export interface IPostsResponse {
  posts: IPost[];
  totalCount: number;
  hasMore: boolean;
}

export interface IPostResponse {
  post: IPost;
  likeCount: number;
  isFollowing: boolean;
}
