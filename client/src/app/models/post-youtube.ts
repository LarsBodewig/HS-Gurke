import { Post } from './post';

export interface YoutubePost extends Post {
  type: string;
  id: string;
  author: string;
  source: string;
  title: string;
  thumbnail: string;
  avatar: string;
  duration: number;
  views: number;
  live: boolean;
}