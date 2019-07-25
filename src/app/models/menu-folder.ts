import { CustomItem, Item } from './menu-item';

export interface CustomFolder extends CustomItem {
  items: Item[];
}

export class MenuFolder implements CustomFolder {
  public title: string;
  public url: string;
  public items: CustomItem[];

  constructor(title: string, url: string, items?: CustomItem[]) {
    this.title = title;
    this.url = url;
    this.items = (items) ? items : [];
  }

  isFolder(): boolean {
    return true;
  }

  getPages(): string[] {
    let pages: string[] = [this.url];
    for (const item of this.items) {
      pages = pages.concat(item.getPages().map(page => this.url + '/' + page));
    }
    return pages;
  }

  addItem(item: CustomItem): boolean {
    const rv: boolean = !this.items.some((i: Item): boolean => {
      return i.url === item.url;
    });
    if (rv) {
      this.items.push(item);
    }
    return rv;
  }

  removeItem(item: CustomItem): boolean {
    const index: number = this.items.indexOf(item);
    const rv: boolean = index >= 0
    if (rv) {
      this.items.splice(index, 1);
    }
    return rv;
  }
}
