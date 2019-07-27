export class HeaderItem  {
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