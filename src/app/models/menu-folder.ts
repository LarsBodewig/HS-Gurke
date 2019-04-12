import { Item, MenuItem } from './menu-item';

export interface Folder {
  title: string;
  url: string;
  items: Item[];
}

export class MenuFolder implements Folder {
  public title: string;
  public url: string;
  public items: MenuItem[];
  public expanded: boolean;

  constructor(folder?: Folder) {
    this.items = [];
    if (folder) {
      this.title = folder.title;
      this.url = folder.url;
      for (const item of folder.items) {
        this.items.push(new MenuItem(item));
      }
    }
  }

  get() {
    for (const item of this.items) {
      item.get();
    }
  }

  public toggle(value?: boolean) {
    if (value) {
      this.expanded = value;
    } else if (this.expanded) {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
    return this.expanded;
  }

  addItem(item: Item): boolean {
    const rv: boolean = !this.items.some((menuItem: MenuItem): boolean => {
      return menuItem.fragment === item.fragment;
    });
    if (rv) {
      this.items.push(new MenuItem(item));
    }
    return rv;
  }

  removeItem(item: MenuItem): boolean {
    const index: number = this.items.indexOf(item);
    const rv: boolean = index >= 0
    if (rv) {
      this.items.splice(index, 1);
    }
    return rv;
  }
}