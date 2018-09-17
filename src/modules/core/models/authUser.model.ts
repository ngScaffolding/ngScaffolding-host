export class BasicUser {
  public userId: string;
  public email: string;
  public name: string;
  public firstName: string;
  public lastName: string;

  public roles: string[] = [];
}

export class AuthUser extends BasicUser {
  public token: string;
  public tokenExpires: Date;
}
