export class BasicUser {
  public userId: string;
  public email: string;
  public name: string;
  public firstName: string;
  public lastName: string;

  public roles: string[] = [];
}

export function createBasicUser(): BasicUser{
  return {
    userId: null,
    email: null,
    name: null,
    firstName: null,
    lastName: null,
    roles:[]
  }
}

