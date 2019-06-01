export interface Post {
  author: string;
  avi: object;
  post: string;
  timestamp: date;
  likes: int;
  photo: object;
  comments: int;
  source: string;
}

  constructor(post?: Post) {
    if (post) {
      this.author = post.author;
      this.avi = post.avi;
      this.post = post.post;
      this.timestamp = post.timestamp;
      this.likes = post.likes;
      this.photo = post.photo;
      this.comments = post.comments;
      this.source = post.source;
    }
  }

  /*equals(post: Post): boolean {

    return this.author === post.author
      && this.avi === post.avi
      && this.post === post.post
      && this.timestamp === post.timestamp
      && this.likes === post.likes
      && this.photo === post.photo
      && this.comments === post.comments
      && this.source === post.source;
  }*/

  public get() {

  }
}
