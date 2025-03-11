
export interface User {
  id: string;
  name: string;
  username: string;
  image?: string;
  email: string;
  createdAt: Date;
  defaultAnonymous?: boolean;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  authorId: string;
  author?: User;
  isAnonymous: boolean;
  createdAt: Date;
  expiresAt?: Date;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}
