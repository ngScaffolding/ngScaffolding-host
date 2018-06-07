declare var require: any;

import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts/highstock';
import * as HC_map from 'highcharts/modules/map';
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_ce from 'highcharts-custom-events';
import { ChartDataService } from '../../services/chartData.service';
import { DataSourceService, LoggingService, MenuService } from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreMenuItem } from '@ngscaffolding/models';
import { Observable } from 'rxjs/Observable';
import { GridsterItem } from 'angular-gridster2';

HC_map(Highcharts);
// require('../../js/worldmap')(Highcharts);

HC_exporting(Highcharts);
HC_ce(Highcharts);

Highcharts.setOptions({
  title: {
    style: {
      color: 'orange'
    }
  }
});

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.component.html',
  styles: ['chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  Highcharts = Highcharts;

  @Input() public unitHeight: number;
  @Input() public gridsterItem: GridsterItem;

  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  private menuSubscription: any;
  private menuItems: CoreMenuItem[];
  // private chart: Highcharts.Chart;

  // public chartOptions: Highcharts.chartOptions;

  public isInDashboard: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggingService,
    private menuService: MenuService,
    private chartDataService: ChartDataService,
    private dataSourceService: DataSourceService
  ) {}

  chartOptions: Highcharts.Chart = {
    title: { text: 'Highcharts chart' },
      subtitle: { text: 'Highcharts chart' },
    series: [{
      data: [1, 2, 3]
    }]
  };

  chart: any;
  public onChartCreated(chart: any) {
    this.chart = chart;
    this.resizeChart();
  }

  loadChart() {
    this.menuItem = this.menuItems.find(menuItem => menuItem.name === this.menuName);

    if (this.menuItem) {
    }
  }

  public resizeChart(): void {
    if (this.gridsterItem) {
      this.chartOptions.chart.height = this.gridsterItem.rows * (this.unitHeight - 10) + (this.gridsterItem.rows - 4) * 10;
      this.chartOptions.chart.width = this.gridsterItem.cols * (this.unitHeight - 10) + (this.gridsterItem.cols - 4) * 10;
    }
    if (this.chart.ref) {
      this.chart.ref.setSize(this.chartOptions.chart.width, this.chartOptions.chart.height, false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resizeChart();
  }

  ngOnInit(): void {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];
    });

    // get Menu Items
    this.menuSubscription = this.menuService.menuSubject.subscribe(menuItems => {
      this.menuItems = menuItems;
    });

    Observable.zip([this.paramSubscription, this.menuSubscription]).subscribe(() => {
      this.loadChart();
    });
  }
  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }

    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }
}
