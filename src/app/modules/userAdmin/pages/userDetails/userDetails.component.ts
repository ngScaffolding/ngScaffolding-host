import { Component, SimpleChanges, AfterViewInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserModel } from '@ngscaffolding/models';
import { UserService, LoggingService } from 'ngscaffolding-core';

@Component({
  selector: 'app-user-details',
  templateUrl: 'userDetails.component.html',
  styleUrls: ['userDetails.component.scss']
})
export class UserDetailsComponent implements AfterViewInit, OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data && changes.data.currentValue) {

    }
  }

  @Input() data: any;

  private userId: string;
  private user: IUserModel;
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private logger: LoggingService) {
    console.log('userDetails Constructor');
  }

  ngAfterViewInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.userId = params['userId'];

    //   this.userService.getUser(this.userId).subscribe(
    //     user => {
    //       this.user = user;
    //     },
    //     err => {
    //       this.logger.error('Failed to Load User', 'Load user', true);
    //     }
    //   );
    // });
  }
}
