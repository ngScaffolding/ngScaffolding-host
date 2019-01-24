import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';

@Component({
  selector: 'app-machine-details',
  templateUrl: 'machineDetails.component.html',
  styleUrls: ['machineDetails.component.scss']
})
export class MachineDetailsComponent implements OnInit, AfterViewInit {
  computerSystemID: string;

  public topData: any;

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {
      this.computerSystemID = params['ComputerSystemID'];

      this.dataSource.getDataSource({name: 'Finder.Device.Details', inputData: JSON.stringify({ComputerSystemID: this.computerSystemID}) })
        .subscribe(results => {
          if (!results.inflight) {
            this.topData = JSON.parse(results.jsonData);
          }
      });

    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }
}
