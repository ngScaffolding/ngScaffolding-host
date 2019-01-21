import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthenticationBase, LoggingService } from 'ngscaffolding-core';

@Component({
  templateUrl: 'logoffPage.component.html'
})
export class LogoffPageComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthenticationBase,
    private router: Router,
    private logger: LoggingService
  ) {}

  ngOnInit(): void {
    this.userAuthService.logoff();
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 5000);
  }
}
