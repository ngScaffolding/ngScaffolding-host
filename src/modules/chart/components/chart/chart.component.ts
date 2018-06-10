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
import {
  DataSourceService,
  LoggingService,
  MenuService
} from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreMenuItem } from '@ngscaffolding/models';
import { Observable } from 'rxjs/Observable';
import { GridsterItem } from 'angular-gridster2';

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

  @Input() public gridsterItem: GridsterItem;

  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  public chart: Chart;
  public highChartsOptions: Highcharts.Options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Basic drilldown'
    },
    legend: {
      enabled: false
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [
      {
        name: 'random series',
        data: [[0, 2], [1, 2], [2, 3], [4, 4], [4, 5]]
      }
    ]
  };

  public isInDashboard: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggingService,
    private menuService: MenuService,
    private chartDataService: ChartDataService,
    private dataSourceService: DataSourceService
  ) {}

  public onChartCreated(chart: any) {
    // this.chart = chart;
    this.resizeChart();
  }

  loadChart() {
    this.chart = new Chart(this.highChartsOptions);
    if (this.menuItem) {
    }
  }

  public resizeChart(): void {
    if (this.gridsterItem && this.chart && this.chart.ref) {
      this.chart.ref.plotHeight =
        this.gridsterItem.rows * (this.unitHeight - 10);
      this.chart.ref.plotWidth = this.gridsterItem.cols * (this.unitWidth - 10);

      this.chart.ref.setSize(
        this.chart.ref.plotWidth,
        this.chart.ref.plotHeight,
        false
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resizeChart();
  }

  ngOnInit(): void {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];
      this.menuItem = this.menuService.getMenuItemByName(this.menuName);
          // get Menu Items
          this.loadChart();
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
