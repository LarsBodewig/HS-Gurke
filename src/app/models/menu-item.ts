export interface Item {
  title: string;
  fragment: string;
  source: string;
}

export class MenuItem implements Item {
  public title: string;
  public fragment: string;
  public source: string;

  constructor(item?: Item) {
    if (item) {
      this.title = item.title;
      this.fragment = item.fragment;
      this.source = item.source;
    }
  }

  /*equals(item: Item): boolean {
    return this.title === item.title
      && this.fragment === item.fragment
      && this.source === item.source;
  }*/

  public get() {

  }
}