export interface TwitterPost {
  id: String;
  author: String;
  source: String;
  post: String;
  timestamp: number;
  reply: String;
  retweet: boolean;
  avatar: String;
  media: String;
}