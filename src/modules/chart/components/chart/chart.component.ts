declare var require: any;

import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService } from 'ngscaffolding-core';
import { GridsterItem } from 'angular-gridster2';
import { DataSourceRequest, ChartDetailModel } from '@ngscaffolding/models';

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styles: ['chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() unitHeight: number;
  @Input() unitWidth: number;
  @Input() unitUpdate: number;

  @Input() isWidget: boolean;

  @Input() itemDetails: ChartDetailModel;
  @Input() inputModel: any;
  @Input() gridsterItem: GridsterItem;

  public chart: Chart;
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
        this.chart = new Chart(this.itemDetails.chartOptions);
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
            // const parsedChartOptions = JSON.parse(this.itemDetails.chartOptions);

            // switch (parsedChartOptions.chart.type) {
            //   case 'bar': {
            //     this.chartDataService.convertToBarChart(this.itemDetails, parsedChartOptions, JSON.parse(response.jsonData));
            //     break;
            //   }
            // }

            this.chart = new Chart(this.itemDetails.chartOptions);
          });
      }
    }
  }

  public resizeChart(): void {
    if (this.gridsterItem && this.chart && this.chart.ref) {
      const height = this.gridsterItem.rows * (this.unitHeight - 10);
      const width = this.gridsterItem.cols * (this.unitWidth - 10);

      this.chart.ref.setSize(height, width);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resizeChart();
  }

  ngOnInit(): void {
    // Get Menu Id
    // this.paramSubscription = this.route.params.subscribe(params => {
    //   this.menuName = params['id'];
    //   this.menuItem = this.menuService.getMenuItemByName(this.menuName);
    // get Menu Items
    this.loadChart();
    // });
  }

  ngOnDestroy(): void {
    // if (this.paramSubscription) {
    //   this.paramSubscription.unsubscribe();
    // }
  }
}
