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
import { DataSourceService, LoggingService } from '../../../core/services';
import { GridsterItem } from 'angular-gridster2';
import { ChartDetailModel } from '../../models/chartDetail.model';
import { DataSourceRequest } from '../../../core/services/dataSource/dataSource.request.model';

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styles: ['chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public unitHeight: number;
  @Input() public unitWidth: number;
  @Input() public unitUpdate: number;

  @Input() public isWidget: boolean;

  @Input() public chartDefinition: ChartDetailModel;
  @Input() public inputModel: any;
  @Input() public gridsterItem: GridsterItem;

  public chart: Chart;
  public highChartsOptions: Highcharts.Options;

  public isInDashboard: boolean;

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
    if (this.chartDefinition) {
      // Get Data from Server
      this.dataSourceService
        .getData(
          { id: this.chartDefinition.dataSourceId, inputData: this.inputModel },
          false
        )
        .subscribe(response => {

          const parsedChartOptions = JSON.parse(this.chartDefinition.chartOptions);

          switch (parsedChartOptions.chart.type) {
            case 'bar': {
              this.chartDataService.convertToBarChart(this.chartDefinition, parsedChartOptions, JSON.parse(response.jsonData));
              break;
            }
          }

          this.chart = new Chart(parsedChartOptions);
        });
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
