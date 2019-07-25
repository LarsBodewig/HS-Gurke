export interface Item {
  title: string;
  url: string;
}

export interface CustomItem extends Item {
  isFolder(): boolean;
  getPages(): string[];
}

export class MenuItem implements CustomItem {
  public title: string;
  public url: string;
  public source: string;

  constructor(title: string, url: string, source: string) {
    this.title = title;
    this.url = url;
    this.source = source;
  }

  isFolder(): boolean {
    return false;
  }

  getPages(): string[] {
    return [this.url];
  }
}

export class HeaderItem implements Item {
  public title: string;
  public url: string;

  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }

  navigate(): void {
    console.log('navigate to ' + this.title);
  }
}