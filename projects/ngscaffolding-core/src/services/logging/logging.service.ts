import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {}

  public error(message: string, methodName = ''): void {
    if (!methodName) {
      console.error(`Method ${methodName}: Error ${message}`);
    } else {
      console.error(`Error ${message}`);
    }
  }

  public warning(message: string, methodName = ''): void {
    if (!methodName) {
      console.warn(`Method ${methodName}: Warning ${message}`);
    } else {
      console.warn(`Warning ${message}`);
    }
  }
  public info(message: string, methodName = ''): void {
    if (methodName) {
      // tslint:disable-next-line:no-console
      console.info(`Info : [Method ${methodName}]  ${message}`);
    } else {
      // tslint:disable-next-line:no-console
      console.info(`Info : ${message}`);
    }
  }
}
