import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import {
  UserAuthenticationBase,
  LoggingService,
  UserAuthenticationQuery
} from 'ngscaffolding-core';
import { finalize, catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private logger: LoggingService,
    private authService: UserAuthenticationBase
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;

    const auth = this.injector.get(UserAuthenticationQuery);

    if (request.url.indexOf('loginUser') === -1) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${auth.getValue().token}`
        }
      });
    }

    return next.handle(request).pipe(
      // Succeeds when there is a response; ignore other events
      map((event: HttpEvent<any>) => {
          ok = event instanceof HttpResponse ? 'succeeded' : '';
          return event;
        }),
        // Operation failed; error is an HttpErrorResponse
      catchError((error: HttpErrorResponse) => {
        ok = 'failed';
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            this.authService.logoff();
          }
        }
        return throwError(error);
      }),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${request.method} "${
          request.urlWithParams
        }" ${ok} in ${elapsed} ms.`;
        this.logger.info(msg);
      })
    );
  }
}
