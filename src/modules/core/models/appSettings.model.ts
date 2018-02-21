export class AppSettings {
  public title: string;
  public iconUrl: string;

  // Error Handling
  public errorShowUser: boolean;
  public errorLogConsole: boolean;
  public errorLogServer: boolean;
  public pageNotFoundText: string;

  // Auth Settings
  public authSaveinLocalStorage: boolean;
  public authShowRememberMe: boolean;
  public authShowForgotPassword: boolean;
  public authShowRegister: boolean;
  public authTermsAndConditions: string;
  public authClientId: string;
  public authClientSecret: string;
  public authScope: string;

  // Screen Furniture
  public showFooter: boolean;
  public showTopNotifications: boolean;
  public showTopSearch: boolean;
  public showTopProfile: boolean;
  public showFullMessages: boolean;
  public showToastMessages: boolean;

  // Input Builder
  public inputShowCalendarIcon: boolean;
  public inputDateTimeFormat = 'dd/mm/yy';
  public inputDateFormat = 'dd/mm/yy';

  // DataGrid Options
  public dataGridIconToolBar: boolean;
  public dataGridAllowExport: boolean;
  public dataGridUseEnterprise: boolean;

  // User Preferences
  prefHideTheme: boolean;


  public apiHome: string;
  public apiAuth: string;
  public apiServers: Map<string, string>;

  public cacheDefaultSeconds: 300;

  public authToken: string;

  constructor() {
    this.apiServers = new Map();
  }
}
