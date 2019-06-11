export interface Post {
  author: string;
  avi: string;
  post: string;
  timestamp: date;
  likes: number;
  photo: string;
  comments: number;
  source: string;
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
