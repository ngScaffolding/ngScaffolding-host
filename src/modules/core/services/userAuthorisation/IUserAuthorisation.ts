export interface IUserAuthorisationService {
  isAuthenticated(): boolean;
  setToken(token: any);
  getToken(): string;
  logon(userName: string, password: string);
  logoff();
}
