declare var require: any;

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService } from 'ngscaffolding-core';
import { ChartDetailModel, IDashboardItem, DataShapes } from 'ngscaffolding-models';
import * as Highcharts from 'highcharts';
// // Loading HighCharts More
// const HighchartsMore = require('highcharts/highcharts-more.src');
// HighchartsMore(Highcharts);

import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);
// Load Gauge
import * as HC_solid_gauge from 'highcharts/modules/solid-gauge.src';
import { HighchartsChartComponent } from 'highcharts-angular';
// HC_solid_gauge(Highcharts);

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
    private buildHighChartOptions: Highcharts.Options;
    public updateChartFlag: boolean;

    constructor(private logger: LoggingService, private chartDataService: ChartDataService, private dataSourceService: DataSourceService) {}

    public logChartInstance(chart: any) {
        this.logger.info('Chart instance: ', chart);
        this.chart = chart;
    }

    // Expose Method in Angular Element
    // https://github.com/angular/angular/issues/22114
    @Input()
    public refreshData = () => {
        this.loadChart(true);
    };

    @Input()
    public updateData = (newData: any) => {
        this.inputModel = newData;
    };

    private loadingComplete() {
        this.buildHighChartOptions = { ...this.buildHighChartOptions };
        this.loadingData = false;
        // this forces the chart to update, resets to false when drawn
        this.updateChartFlag = true;
    }

    private loadChart(forceRefresh: boolean = false) {
        if (this.itemDetails) {
            this.loadingError = false;
            if (!this.itemDetails.dataSourceName) {
                // No DataSource - Just do the Chart
                this.loadingData = false;
                this.buildHighChartOptions = this.itemDetails.chartOptions;
                this.loadingComplete();
            } else {
                this.loadingData = true;
                // Get Data from Server
                this.dataSourceService
                    .getDataSource({
                        name: this.itemDetails.dataSourceName.toString(),
                        inputData: this.inputModel,
                        forceRefresh: forceRefresh
                    })
                    .subscribe(
                        results => {
                            if (!results.inflight) {
                                if (results.error) {
                                    this.loadingError = true;
                                    this.loadingData = false;
                                } else {
                                    const chartDataService = new ChartDataService();
                                    if (!this.itemDetails.chartOptions.series || this.itemDetails.chartOptions.series.length === 0) {
                                        // Set to empty array if theres nothing there
                                        this.itemDetails.chartOptions.series = [{}];
                                    }
                                    const shaped = chartDataService.shapeDataForSeries(this.itemDetails, results.jsonData);

                                    if (this.itemDetails.dataShape === DataShapes.GroupByOutput) {
                                        this.itemDetails.chartOptions.series = shaped.data;
                                    } else {
                                        this.itemDetails.chartOptions.series[0].data = shaped.data;
                                    }
                                    if (shaped.xAxisLabels) {
                                        if (!this.itemDetails.chartOptions.xAxis) {
                                            this.itemDetails.chartOptions.xAxis = {};
                                        }
                                        this.itemDetails.chartOptions.xAxis.categories = shaped.xAxisLabels;
                                    }
                                    this.buildHighChartOptions = this.itemDetails.chartOptions;
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
