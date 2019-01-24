import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';
import { IDashboardItem } from '@ngscaffolding/models';
const jsonQuery = require('json-query');

@Component({
  selector: 'app-digital-readout',
  templateUrl: 'digitalReadout.component.html',
  styleUrls: ['digitalReadout.component.scss']
})
export class DigitalReadoutComponent implements IDashboardItem, OnInit {
  @Input() itemDetails: any;
  @Input() unitUpdate: any;

  displayValue: string;

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {});
  }

  refreshData() {
    this.getData();
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.dataSource.getDataSource({ name: this.itemDetails.dataSourceName }).subscribe(results => {
      if (!results.inflight) {
        const data = JSON.parse(results.jsonData);

        this.displayValue = jsonQuery(this.itemDetails.jsonQuery, { data: data }).value;
      }
    });
  }

}
