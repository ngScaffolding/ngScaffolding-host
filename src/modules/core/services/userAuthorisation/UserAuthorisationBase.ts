export abstract class UserAuthorisationBase {
  isAuthenticated(): boolean { return null; }
  setToken(token: any) { }
  getToken(): string { return null; }
  logon(userName: string, password: string) { }
  logoff() { }
}
