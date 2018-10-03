import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from '../../../core/services';




@Component({
  templateUrl: 'topDashboard.component.html',
  styles: ['topDashboard.component.scss']
})
export class TopDashboardComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {

      // this.dataSource.getData({name: 'Finder.Device.Details', inputData: JSON.stringify({ComputerSystemID: this.computerSystemID}) })
      // .subscribe(data => {
      //   this.topData = JSON.parse(data.jsonData);
      // });

    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }
}
