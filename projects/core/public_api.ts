/*
 * Public API Surface of ngscaffolding-core
 */

export { CoreModule } from './ngscaffolding-core.module';

export { AppSettingsQuery } from './services/appSettings/appSettings.query';
export { AppSettingsService } from './services/appSettings/appSettings.service';
export { AppSettingsState, AppSettingsStore } from './services/appSettings/appSettings.store';

export { BroadcastService, BroadcastTypes } from './services/broadcast/broadcast.service';
export { ComponentLoaderService } from './services/componentLoader.service';
export { CoreErrorHandlerService } from './services/coreErrorHandler/coreErrorHandler.service';
export { DataSourceQuery } from './services/dataSource/dataSource.query';
export { DataSourceService } from './services/dataSource/dataSource.service';
export { DataSourceState, DataSourceStore } from './services/dataSource/dataSource.store';

export { LoggingService } from './services/logging/logging.service';
export { MenuQuery } from './services/menu/menu.query';
export { MenuService } from './services/menu/menu.service';
export { MenuState, MenuStore } from './services/menu/menu.store';

export { NotificationService } from './services/notification/notification.service';
export { ReferenceValuesQuery } from './services/referenceValues/referenceValues.query';
export { ReferenceValuesState, ReferenceValuesStore } from './services/referenceValues/referenceValues.store';
export { ReferenceValuesService } from './services/referenceValues/refrenceValues.service';

export { RolesQuery } from './services/rolesService/roles.query';
export { RolesService } from './services/rolesService/roles.service';
export { RoleState, RolesStore } from './services/rolesService/roles.store';

export { SpinnerService } from './services/spinnerService/spinner.service';

export { UserAuthenticationBase } from './services/userAuthentication/UserAuthenticationBase';
export { UserAuthenticationQuery } from './services/userAuthentication/userAuthentication.query';
export { UserAuthenticationService } from './services/userAuthentication/userAuthentication.service';
export { OAuthService } from './services/userAuthentication/userAuthentication.oauth.service';
export { AuthenticationState, AuthenticationStore } from './services/userAuthentication/userAuthentication.store';

export { UserPreferencesQuery } from './services/userPreferences/userPreferences.query';
export { UserPreferencesService } from './services/userPreferences/userPreferences.service';
export { UserPreferencesState, UserPreferencesStore } from './services/userPreferences/userPreferences.store';

export { WidgetQuery } from './services/widgetsService/widget.query';
export { WidgetService } from './services/widgetsService/widget.service';
export { WidgetState, WidgetStore } from './services/widgetsService/widget.store';

export { UserService } from './services/userService/user.service';
export { UserServiceBase } from './services/userService/user.service.base';
export { SoftwareVersion, VersionsService } from './services/versions/versions.service';

export { FillHeightDirective } from './directives/fill-height.directive';

// Pipes
export { ButtonColourPipe } from './pipes/buttonColour.pipe';
export { NgsDatePipe } from './pipes/ngsDate.pipe';
export { NgsDateTimePipe } from './pipes/ngsDateTime.pipe';
export { TruncateTextPipe } from './pipes/truncateText.pipe';

// Guards
export { AuthoriseRoleGuard } from './routeGuards/authoriseRoleGuard';

export { DialogWindowComponent } from './components/dialogWindow/dialogWindow.component';
