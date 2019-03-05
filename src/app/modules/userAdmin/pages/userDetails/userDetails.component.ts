import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserModel } from '@ngscaffolding/models';

@Component({
  templateUrl: 'userDetails.component.html',
  styleUrls: ['userDetails.component.scss']
})
export class UserDetailsComponent implements AfterViewInit {
  private userId: string;
  private user: IUserModel;
  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
  }
}
