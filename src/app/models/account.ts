import { Folder } from './menu-folder';

export interface Account {
    email: string;
    verified: boolean;
    items: Folder;
}