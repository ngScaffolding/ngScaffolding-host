import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';

@Component({
  selector: 'app-machine-details',
  templateUrl: 'machineDetails.component.html',
  styles: ['machineDetails.component.scss']
})
export class MachineDetailsComponent implements OnInit, AfterViewInit {
  computerSystemID: string;

  public topData: any;

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {
      this.computerSystemID = params['ComputerSystemID'];

      this.dataSource.getData({name: 'Finder.Device.Details', inputData: JSON.stringify({ComputerSystemID: this.computerSystemID}) })
      .subscribe(data => {
        this.topData = JSON.parse(data.jsonData);
      });

    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }
}
