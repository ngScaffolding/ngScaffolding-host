import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';
var jsonQuery = require('json-query')

@Component({
  selector: 'app-digital-readout',
  templateUrl: 'digitalReadout.component.html',
  styleUrls: ['digitalReadout.component.scss']
})
export class DigitalReadoutComponent implements OnInit, AfterViewInit {

  @Input() itemDetails: any;

  displayValue: string;

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {


    });
  }

  ngOnInit(): void {
    this.dataSource.getDataSource({name: this.itemDetails.dataSourceName}).subscribe(results=>{
      if(!results.inflight){
        const data = JSON.parse(results.jsonData);

        this.displayValue = jsonQuery(this.itemDetails.jsonQuery, {data: data}).value;
      }
    });

  }

  ngAfterViewInit(): void {

  }
}
