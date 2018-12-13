declare var require: any;

import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService } from 'ngscaffolding-core';
import { DataSourceRequest, ChartDetailModel } from '@ngscaffolding/models';
import * as Highcharts from 'highcharts';
// Loading HighCharts More
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);

// Load Gauge
import * as HC_solid_gauge from 'highcharts/modules/solid-gauge.src';
HC_solid_gauge(Highcharts);

import { Observable } from 'rxjs';
import { RequiredValidator } from '@angular/forms';

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

  public chart: Highcharts.Chart;
  Highcharts = Highcharts; // required
  public highChartsOptions: Highcharts.Options;
  private updateChartFlag: boolean;

  constructor(private logger: LoggingService, private chartDataService: ChartDataService, private dataSourceService: DataSourceService) {}

  public reloadChart() {
    this.loadChart().subscribe(next => {
      // this forces the chart to update, resets to false when drawn
      this.updateChartFlag = true;
    });
  }

  private chartCallback(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  private loadChart(): Observable<null> {
    return new Observable<null>(observer => {
      if (this.itemDetails) {
        if (!this.itemDetails.dataSourceName) {
          // No DataSource - Just do the Chart
          this.highChartsOptions = this.itemDetails.chartOptions;
          observer.next(null);
          observer.complete();
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
              const chartDataService = new ChartDataService();
              this.itemDetails.chartOptions.series[0].data = chartDataService.shapeDataForSeries(this.itemDetails, JSON.parse(response.jsonData)).data;
              this.highChartsOptions = this.itemDetails.chartOptions;
              observer.next(null);
              observer.complete();
            });
        }
      }
    });
  }

  public resizeChart(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Chart: Input changed. loading');
    if (changes['itemDetails'].currentValue) {
      this.reloadChart();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
