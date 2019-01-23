import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';

@Component({
  selector: 'app-digital-readout',
  templateUrl: 'digitalReadout.component.html',
  styleUrls: ['digitalReadout.component.scss']
})
export class DigitalReadoutComponent implements OnInit, AfterViewInit {

  @Input() itemDetails: any;

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {


    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }
}
