export class AuthUser {
  public token: string;
  public tokenExpires: Date;
  public userId: string;
  public email: string;
  public name: string;
  public firstName: string;
  public lastName: string;

  public roles: Array<string>;

  constructor() {
    this.roles = new Array<string>();
  }
}
