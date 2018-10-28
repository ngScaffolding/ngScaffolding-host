import { Injectable } from '@angular/core';

@Injectable()
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
    if (!methodName) {
      console.info(`Method ${methodName}: Info ${message}`);
    } else {
      console.info(`Info ${message}`);
    }
  }
}
