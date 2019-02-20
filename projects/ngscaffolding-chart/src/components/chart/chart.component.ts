declare var require: any;

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService } from 'ngscaffolding-core';
import { ChartDetailModel, IDashboardItem } from '@ngscaffolding/models';
import * as Highcharts from 'highcharts';
// Loading HighCharts More
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);

// Load Gauge
import * as HC_solid_gauge from 'highcharts/modules/solid-gauge.src';
import { timeout } from 'rxjs/internal/operators/timeout';
HC_solid_gauge(Highcharts);

@Component({
  selector: 'ngs-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})
export class ChartComponent implements IDashboardItem, OnChanges {
  @Input() chartStyle: any;

  @Input() isWidget: boolean;

  @Input() itemDetails: ChartDetailModel;
  @Input() inputModel: any;

  public chart: any;
  public loadingData = false;
  public loadingError = false;

  Highcharts = Highcharts; // required
  public highChartsOptions: Highcharts.Options;
  public updateChartFlag: boolean;

  constructor(private logger: LoggingService, private chartDataService: ChartDataService, private dataSourceService: DataSourceService) {}

  public logChartInstance(chart: any) {
    console.log('Chart instance: ', chart);
    this.chart = chart;
  }

  public refreshData() {
    this.loadChart();
  }

  private loadingComplete() {
    this.loadingData = false;
    // this forces the chart to update, resets to false when drawn
    this.updateChartFlag = true;
  }

  private loadChart() {
    if (this.itemDetails) {
      this.loadingError = false;
      if (!this.itemDetails.dataSourceName) {
        // No DataSource - Just do the Chart
        this.loadingData = false;
        this.highChartsOptions = this.itemDetails.chartOptions;
        this.loadingComplete();
      } else {
        this.loadingData = true;
        // Get Data from Server
        this.dataSourceService
          .getDataSource({ name: this.itemDetails.dataSourceName.toString(), inputData: this.inputModel })
          .subscribe(
            results => {
              if (!results.inflight) {
                if (results.error) {
                  this.loadingError = true;
                  this.loadingData = false;
                } else {
                  const chartDataService = new ChartDataService();
                  this.itemDetails.chartOptions.series[0].data = chartDataService.shapeDataForSeries(this.itemDetails, JSON.parse(results.jsonData)).data;
                  this.highChartsOptions = this.itemDetails.chartOptions;
                }

                this.loadingComplete();
              }
            },
            err => {
              this.loadingError = true;
              this.loadingData = false;
            }
          );
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Chart: Input changed. loading');
    this.loadChart();
  }
}
