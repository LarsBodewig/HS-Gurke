import { Post } from './post';

export interface TwitterPost extends Post {
  type: string;
  id: string;
  author: string;
  source: string;
  post: string;
  timestamp: number;
  reply: string;
  retweet: boolean;
  avatar: string;
  media: string;
}