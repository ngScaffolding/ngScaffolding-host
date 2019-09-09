import { BaseEntity } from './baseEntity.model';

export class AppSettingsValue extends BaseEntity {
  value: any;
}

export enum AppSettings {
  title = 'title',
  iconUrl = 'iconUrl',

  // Error Handling
  errorShowUser = 'errorShowUser',
  errorLogConsole = 'errorLogConsole',
  errorLogServer = 'errorLogServer',
  pageNotFoundText = 'pageNotFoundText',

  // Auth Settings
  authSaveinLocalStorage = 'authSaveinLocalStorage',
  authShowRememberMe = 'authShowRememberMe',
  authShowForgotPassword = 'authShowForgotPassword',
  authShowRegister = 'authShowRegister',
  authTermsAndConditions = 'authTermsAndConditions',
  authClientId = 'authClientId',
  authClientSecret = 'authClientSecret',
  authScope = 'authScope',
  authUserIdIsEmail = 'authUserIdIsEmail',
  authTokenEndpoint = 'authTokenEndpoint',
  authPasswordMinLength = 'authPasswordMinLength',
  authPasswordUpperCase = 'authPasswordUpperCase',
  authPasswordLowerCase = 'authPasswordLowerCase',
  authPasswordNumeric = 'authPasswordNumeric',
  authPasswordSpecial = 'authPasswordSpecial',

  // Screen Furniture
  showFooter = 'showFooter',
  showTopNotifications = 'showTopNotifications',
  showTopSearch = 'showTopSearch',
  showTopProfile = 'showTopProfile',
  showFullMessages = 'showFullMessages',
  showToastMessages = 'showToastMessages',
  showProfileSetting = 'showProfileSetting',
  showProfilePicture = 'showProfilePicture',
  showUserSetting = 'showUserSetting',
  menuType = 'menuType',

  // Input Builder
  inputShowCalendarIcon = 'inputShowCalendarIcon',
  inputDateTimeFormat = 'inputDateTimeFormat',
  inputDateFormat = 'inputDateFormat',
  inputDateForceUTC = 'inputDateForceUTC',

  // moment Formats for dates
  momentDateTimeFormat = 'momentDateTimeFormat',
  momentDateFormat = 'momentDateFormat',

  // DataGrid Options
  dataGridIconToolBar = 'dataGridIconToolBar',
  dataGridAllowConfigureColumns = 'dataGridAllowConfigureColumns',
  dataGridAllowExport = 'dataGridAllowExport',
  dataGridAllowSaveView = 'dataGridAllowSaveView',
  dataGridAllowResetView = 'dataGridAllowResetView',
  dataGridAllowShareView = 'dataGridAllowShareView',

  dataGridUseEnterprise = 'dataGridUseEnterprise',

  // User Preferences
  prefHideTheme = 'prefHideTheme',

  apiHome = 'apiHome',
  apiAuth = 'apiAuth',
  apiServers = 'apiServers',

  cacheDefaultSeconds = 'cacheDefaultSeconds',

  // Mobile settings
  isMobile = 'isMobile',
  mobileTitle = 'mobileTitle'
}
