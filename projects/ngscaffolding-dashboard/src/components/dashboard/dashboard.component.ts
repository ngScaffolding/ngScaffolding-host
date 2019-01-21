import { Component, OnInit, OnDestroy, ComponentRef, ViewChildren, QueryList, OnChanges, SimpleChanges, Type } from '@angular/core';
import { DataSourceService, LoggingService, MenuQuery, WidgetQuery, AppSettingsQuery } from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreMenuItem, WidgetModelBase, WidgetDetails, WidgetTypes } from '@ngscaffolding/models';

import { DashboardModel } from '@ngscaffolding/models';

import { ChartComponent, ChartDataService } from 'ngscaffolding-chart';

import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType, GridsterItemComponent, GridsterItemComponentInterface } from 'angular-gridster2';
import { Type } from '@angular/compiler/src/core';
import { HtmlContainerComponent } from '../htmlContainer/htmlContainer.component';

@Component({
  selector: 'ngs-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChildren(GridsterItemComponent) gridsterItems: QueryList<GridsterItemComponent>;

  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  public options: GridsterConfig;
  public dashboard: DashboardModel;

  private components: any[] = [];
  private dynmicTypes: Type<any>[];

  // public component = ChartComponent;
  public componentInputs = {};

  public unitHeight: number;
  public loadingData = false;
  public galleryShown = false;

  constructor(
    private widgetQuery: WidgetQuery,
    private appSettingsQuery: AppSettingsQuery,
    private route: ActivatedRoute,
    private logger: LoggingService,
    private menuQuery: MenuQuery,
    private chartDataService: ChartDataService,
    private dataSourceService: DataSourceService
  ) {
    this.appSettingsQuery
      .select(store => store.dynamicTypes)
      .subscribe(types => {
        this.dynmicTypes = types;
      });
  }

  public getComponent(widgetDetails: WidgetDetails) {
    switch (widgetDetails.widget.type) {
      case WidgetTypes.GridView: {
        break;
      }
      case WidgetTypes.Chart: {
        return ChartComponent;
      }
      case WidgetTypes.Html: {
        return HtmlContainerComponent;
      }
      default: {
        let returnType: Type<any>;
        returnType = this.dynmicTypes.find(type => type.name.toLowerCase() === widgetDetails.widget.type.toLowerCase());
        return returnType;
      }
    }
  }

  loadDashboard() {
    this.loadingData = true;

    this.menuQuery.selectEntity(this.menuName).subscribe(menuItem => {
      if (menuItem) {
        this.menuItem = JSON.parse(JSON.stringify(menuItem));

        if (this.menuItem && this.menuItem.menuDetails) {
          this.dashboard = this.menuItem.menuDetails as DashboardModel;
        }

        this.loadingData = false;
      }
    });
  }

  onToolbarClicked(button: string) {
    switch (button) {
      case 'add': {
        this.galleryShown = !this.galleryShown;
        break;
      }
    }
  }
  onAddWidget(name: string) {
    this.galleryShown = false;

    const readOnlyWidget = this.widgetQuery.getEntity(name);
    const widgetModel = JSON.parse(JSON.stringify(readOnlyWidget));

    if (widgetModel) {
      const widgetDetails: WidgetDetails = {
        widgetName: name,
        cols: widgetModel.initialWidth > 0 ? widgetModel.initialWidth : 2,
        rows: widgetModel.initialHeight > 0 ? widgetModel.initialHeight : 1,
        widget: widgetModel
      };
      this.dashboard.widgets.push(widgetDetails);
    }
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
      minRows: 6,
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
