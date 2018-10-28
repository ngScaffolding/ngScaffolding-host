import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthorisationBase, LoggingService } from 'ngscaffolding-core';

@Component({
  templateUrl: 'logoffPage.component.html'
})
export class LogoffPageComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthorisationBase,
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
