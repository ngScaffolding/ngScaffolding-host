import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { UserAuthorisationService, LoggingService } from '@ngscaffolding/core';
import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private logger: LoggingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;

    const auth = this.injector.get(UserAuthorisationService);

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    });

    return next.handle(request)
    .pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        // Operation failed; error is an HttpErrorResponse
        error => ok = 'failed'
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${request.method} "${request.urlWithParams}" ${ok} in ${elapsed} ms.`;
        this.logger.info(msg);
      })
    );

  //     event => {
  //       this.logger.info(`Returned Data ${JSON.stringify(request.body)}`, 'HttpInterceptor');
  //     },
  //     error => {
  //     if (error instanceof HttpErrorResponse && error.status === 401) {
  //         // handle 401 errors
  //       this.logger.info(`Returned 401 Error`, 'HttpInterceptor');
  //         auth.logoff();
  //     }
  // });
  }
}
