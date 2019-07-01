import { Component, OnInit } from '@angular/core';
import { LoggingService, AppSettingsService } from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppSettings } from 'ngscaffolding-models';
// import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  templateUrl: 'pageNotFound.component.html',
  styleUrls: ['pageNotFound.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  private readonly defaultMessage = 'The page you requested could not be found';
  message: string;

  constructor(private logger: LoggingService, private appSettings: AppSettingsService
  ) {
      this.message = appSettings.getValue(AppSettings.pageNotFoundText) || this.defaultMessage;
  }

  ngOnInit() {
  }
}
