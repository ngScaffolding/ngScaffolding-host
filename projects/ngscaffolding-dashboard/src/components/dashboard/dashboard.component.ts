import { Component, OnInit, OnDestroy, ComponentRef, ViewChildren, QueryList, OnChanges, SimpleChanges } from '@angular/core';
import { DataSourceService, LoggingService, MenuService, MenuQuery } from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreMenuItem, WidgetModelBase, WidgetDetails, WidgetTypes, ChartDetailModel } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

import { DashboardModel } from '@ngscaffolding/models';

import { DataGridComponent } from 'ngscaffolding-datagrid';
import { ChartComponent, ChartDataService } from 'ngscaffolding-chart';

import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType, GridsterItemComponent, GridsterItemComponentInterface } from 'angular-gridster2';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styles: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChildren(GridsterItemComponent) gridsterItems: QueryList<GridsterItemComponent>;

  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  public options: GridsterConfig;
  public dashboard: DashboardModel;

  private components: any[] = [];

  // public component = ChartComponent;
  public componentInputs = {};

  public unitHeight: number;
  public loadingData = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggingService,
    private menuQuery: MenuQuery,
    private chartDataService: ChartDataService,
    private dataSourceService: DataSourceService
  ) {}

  public widgetContentDetails: any;
  public getComponent(widgetDetails: WidgetDetails) {
    switch (widgetDetails.widget.type) {
      case WidgetTypes.GridView: {
        break;
      }
      case WidgetTypes.Chart: {
        const chart = new ChartComponent(this.logger, this.chartDataService, this.dataSourceService);
        this.widgetContentDetails = widgetDetails.widget.itemDetails as ChartDetailModel;

        return ChartComponent;
      }
      case WidgetTypes.Html: {
        break;
      }
    }
  }

  loadDashboard() {
    this.loadingData = true;

    this.menuQuery.selectEntity(this.menuName).subscribe(menuItem => {
      if (menuItem) {
        this.menuItem = menuItem;

        if (this.menuItem && this.menuItem.menuDetails) {
          this.dashboard = this.menuItem.menuDetails as DashboardModel;
        }

        // Set unitheight for later resize
        // this.dashboard.widgets.forEach(widgetDetail => {
        //   widgetDetail['unitHeight'] = 0;
        //   widgetDetail['unitWidth'] = 0;
        //   widgetDetail['unitUpdate'] = 0;

        //   widgetDetail['isWidget'] = true;
        // });
        this.loadingData = false;
      }
    });
  }

  private itemChange(item, itemComponent) {
    window.dispatchEvent(new Event('resize'));
  }

  public itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    if (itemComponent.gridster.curRowHeight > 1) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  public componentCreated(compRef: ComponentRef<any>) {
    // utilize compRef in some way ...
    this.components.push(compRef.instance);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.gridsterItems && this.gridsterItems.length > 0 && this.gridsterItems[0].gridster.curRowHeight > 1) {
      this.unitHeight = this.gridsterItems[0].gridster.curRowHeight;
    }
  }

  ngOnInit() {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];
      this.loadDashboard();
    });

    this.options = {
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.itemResize.bind(this),

      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      mobileBreakpoint: 640,
      minCols: 12,
      maxCols: 12,
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
        enabled: true
      },
      resizable: {
        enabled: true
      },
      pushItems: true,
      displayGrid: DisplayGrid.OnDragAndResize,
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

  removeItem(item) {}

  addItem() {}
}
