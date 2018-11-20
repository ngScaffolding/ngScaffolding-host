declare var require: any;

import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService } from 'ngscaffolding-core';
import { GridsterItem } from 'angular-gridster2';
import { DataSourceRequest, ChartDetailModel } from '@ngscaffolding/models';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'ng-chart',
  templateUrl: 'chart.component.html',
  styles: ['chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() unitHeight: number;
  @Input() unitWidth: number;
  @Input() unitUpdate: number;
  @Input() chartStyle: any;

  @Input() isWidget: boolean;

  @Input() itemDetails: ChartDetailModel;
  @Input() inputModel: any;
  @Input() gridsterItem: GridsterItem;

  public chart: Highcharts.ChartObject;
  Highcharts = Highcharts; // required
  public highChartsOptions: Highcharts.Options;

  constructor(
    private logger: LoggingService,
    private chartDataService: ChartDataService,
    private dataSourceService: DataSourceService
  ) {}

  public onChartCreated(chart: any) {
    // this.chart = chart;
    this.resizeChart();
  }

  loadChart() {
    if (this.itemDetails) {
      if (!this.itemDetails.dataSourceName) {
        // No DataSource - Just do the Chart
        this.chart = new Highcharts.Chart(this.itemDetails.chartOptions);
      } else {
        // Get Data from Server
        this.dataSourceService
          .getData(
            {
              name: this.itemDetails.dataSourceName.toString(),
              inputData: this.inputModel
            },
            false
          )
          .subscribe(response => {
            this.chart = new Highcharts.Chart(this.itemDetails.chartOptions);
          });
      }
    }
  }

  public resizeChart(): void {
    // if (this.gridsterItem && this.chart && this.chart.ref) {
    //   const height = this.gridsterItem.rows * (this.unitHeight - 10);
    //   const width = this.gridsterItem.cols * (this.unitWidth - 10);

    //   this.chart.ref.setSize(height, width);
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Chart: Input changed. loading');
    if (changes['itemDetails'].currentValue) {
      this.loadChart();

    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
