import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Import RxJs required methods



import { ErrorModel } from '../../models/error.model';
import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';
import { AppSettingsService } from '../appSettings/appSettings.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CoreErrorHandlerService extends ErrorHandler {
    constructor(private appSettingsService: AppSettingsService,
        private notificationService: NotificationService,
        private authService: UserAuthorisationBase,
        private http: HttpClient) {
        super();
    }

    public logError(error, source: string = null) {

    }

    private processError(error, source: string = null) {

    }

    handleError(error, source: string = null) {
        super.handleError(error);

        if (this.appSettingsService.errorLogConsole) {
            console.error(error.message);
        }
        if (this.appSettingsService.errorLogServer) {
            const errorModel = new ErrorModel(error);

            if (source) {
                errorModel.source = source;
            }

            if (this.authService && this.authService.currentUser) {
                errorModel.userId = this.authService.currentUser.userId;
            }

            if (error.stack) {
                errorModel.stackTrace = error.stack;
            }

            // Consume any errors here. Otherwise we will just get stuck
            try {
                // This post is a fire and forget. Don't have to authorise either
                this.http.post(this.appSettingsService.apiHome + '/api/v1/error', errorModel)
                    .subscribe((data) => {
                        // alert('ID: ' + data.id);
                    },
                    (err) => {
                        console.log('Unable to send Error to Server, offline?');
                    });
            } catch (err) {
                console.log('Unable to send Error to Server, offline?');
            }
        }
        if (this.appSettingsService.errorShowUser) {

        }
    }
}
