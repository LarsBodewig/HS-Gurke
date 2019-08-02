import { Folder } from './menu-folder';
import { Post } from './post';

export interface Account {
    email: string;
    verified: boolean;
    items: Folder;
    unseen: Post[];
}