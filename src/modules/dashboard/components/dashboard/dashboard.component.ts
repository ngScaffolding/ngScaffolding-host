import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataSourceService, LoggingService, MenuService } from '../../../core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreMenuItem } from '@ngscaffolding/models';
import { Observable } from 'rxjs/Observable';

import { DashboardModel } from '@ngscaffolding/models';

import { DataGridComponent } from '../../../datagrid/components/dataGrid/dataGrid.component';
import { ChartComponent } from '../../../chart/components/chart/chart.component';

import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styles: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  private options: GridsterConfig;
  private dashboard: DashboardModel;

  public component = ChartComponent;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private logger: LoggingService,
    private menuService: MenuService,
    private dataSourceService: DataSourceService) {}

    loadDashboard(){
      this.menuItem = this.menuService.getMenuItemByName(this.menuName);

      if (this.menuItem && this.menuItem.jsonSerialized) {
        this.dashboard = JSON.parse(this.menuItem.jsonSerialized) as DashboardModel;
      }
    }



  private itemChange(item, itemComponent) {
    console.log('itemChanged', item, itemComponent);
  }

  private itemResize(item, itemComponent) {
    console.log('itemResized', item, itemComponent);
  }

  ngOnInit() {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];
      this.loadDashboard();
    });

    this.options = {
      itemChangeCallback: this.itemChange,
       itemResizeCallback: this.itemResize,

      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: true
    };
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item) {

  }

  addItem() {

  }
}
