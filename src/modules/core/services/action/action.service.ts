import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService, LoggingService } from '../../coreModule';

@Injectable()
export class ActionService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private logger: LoggingService
  ) {}
}
