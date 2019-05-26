import { MenuFolder } from './menu-folder';
import { MenuItem } from './menu-item';


export interface Account {
    pages: Array<MenuFolder | MenuItem>;
}
