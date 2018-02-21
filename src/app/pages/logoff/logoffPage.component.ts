import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthorisationService, LoggingService } from '../../../modules/core/coreModule';

@Component({
  templateUrl: 'logoffPage.component.html'
})
export class LogoffPageComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthorisationService,
    private router: Router,
    private logger: LoggingService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.userAuthService.logoff();
      this.router.navigateByUrl('/login');
    }, 5000);
  }
}
