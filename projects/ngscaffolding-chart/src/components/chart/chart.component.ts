declare var require: any;

import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService } from 'ngscaffolding-core';
import { ChartDetailModel } from '@ngscaffolding/models';
import * as Highcharts from 'highcharts';
// Loading HighCharts More
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);

// Load Gauge
import * as HC_solid_gauge from 'highcharts/modules/solid-gauge.src';
HC_solid_gauge(Highcharts);

@Component({
  selector: 'ng-chart',
  templateUrl: 'chart.component.html',
  styles: ['chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() chartStyle: any;

  @Input() isWidget: boolean;

  @Input() itemDetails: ChartDetailModel;
  @Input() inputModel: any;

  public chart: any;
  public loadingData = false;

  Highcharts = Highcharts; // required
  public highChartsOptions: Highcharts.Options;
  public updateChartFlag: boolean;

  constructor(private logger: LoggingService, private chartDataService: ChartDataService, private dataSourceService: DataSourceService) {}

  public logChartInstance(chart: any) {
    console.log('Chart instance: ', chart);
    this.chart = chart;
  }

  private loadingComplete() {
    this.loadingData = false;
    // this forces the chart to update, resets to false when drawn
    this.updateChartFlag = true;
  }

  private loadChart() {
    if (this.itemDetails) {
      if (!this.itemDetails.dataSourceName) {
        // No DataSource - Just do the Chart
        this.loadingData = false;
        this.highChartsOptions = this.itemDetails.chartOptions;
        this.loadingComplete();
      } else {
        this.loadingData = true;
        // Get Data from Server
        this.dataSourceService
          .getData(
            {
              name: this.itemDetails.dataSourceName.toString(),
              inputData: this.inputModel
            },
            false
          )
          .subscribe(
            response => {
              const chartDataService = new ChartDataService();
              this.itemDetails.chartOptions.series[0].data = chartDataService.shapeDataForSeries(this.itemDetails, JSON.parse(response.jsonData)).data;
              this.highChartsOptions = this.itemDetails.chartOptions;

              this.loadingComplete();
            },
            err => {
              // TODO: Show Error to User?
              this.loadingComplete();
            }
          );
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
      console.log('Chart: Input changed. loading');
      this.loadChart();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
