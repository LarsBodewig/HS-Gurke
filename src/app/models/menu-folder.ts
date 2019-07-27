import { CustomItem } from './menu-custom-item';

export interface Folder extends CustomItem {
  children: CustomItem[];
}