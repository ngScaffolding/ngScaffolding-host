import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { UserAuthorisationService, LoggingService } from '@ngscaffolding/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private logger: LoggingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const auth = this.injector.get(UserAuthorisationService);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    });
    return next.handle(request).do(
      event => {
        this.logger.info(`Returned Data ${request.body}`, 'HttpInterceptor');
      },
      error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
          // handle 401 errors
        this.logger.info(`Returned 401 Error`, 'HttpInterceptor');
          auth.logoff();
      }
  });
  }
}
