import { Component, OnInit, OnDestroy, ComponentRef, ViewChildren, QueryList, OnChanges, SimpleChanges, Type, ViewChild } from '@angular/core';
import {
  DataSourceService,
  LoggingService,
  MenuQuery,
  WidgetQuery,
  AppSettingsQuery,
  MenuService,
  UserAuthenticationQuery,
  NotificationService
} from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreMenuItem, WidgetModelBase, WidgetDetails, WidgetTypes, InputBuilderDefinition, IDashboardItem, BasicUser } from '@ngscaffolding/models';

import { DashboardModel, DialogOptions } from '@ngscaffolding/models';

import { ChartComponent, ChartDataService } from 'ngscaffolding-chart';

import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType, GridsterItemComponent, GridsterItemComponentInterface } from 'angular-gridster2';
import { HtmlContainerComponent } from '../htmlContainer/htmlContainer.component';
import { InputBuilderPopupComponent } from 'ngscaffolding-inputbuilder';
import { DynamicComponent } from 'ng-dynamic-component';
import { SaveDetails } from '../saveInput/saveInput.component';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import {ConfirmationService} from 'primeng/primeng';

@Component({
  selector: 'ngs-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChildren(GridsterItemComponent) gridsterItems: QueryList<GridsterItemComponent>;
  @ViewChildren(DynamicComponent) component: DynamicComponent;
  @ViewChild(InputBuilderPopupComponent) actionInputPopup: InputBuilderPopupComponent;

  private paramSubscription: any;
  private menuName: string;
  menuItem: CoreMenuItem;

  public options: GridsterConfig;
  public dashboard: DashboardModel;

  // toolbar visible
  public showSave = false;
  public showSaveAs = false;
  public showAdd = false;
  public showDelete = false;
  public showShare = false;

  private components: any[] = [];
  private dynmicTypes: Type<any>[];

  // Input Details
  actionInputDefinition: InputBuilderDefinition;
  actionValues: any;

  // Save As Bits
  saveShown = false;

  // public component = ChartComponent;
  public componentInputs = {};

  public unitHeight: number;
  public loadingData = false;
  public galleryShown = false;

  private changesMade = false;

  constructor(
    private widgetQuery: WidgetQuery,
    private appSettingsQuery: AppSettingsQuery,
    private authQuery: UserAuthenticationQuery,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private logger: LoggingService,
    private menuQuery: MenuQuery,
    private menuService: MenuService
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

        this.setButtons();

        this.changesMade = false;
        this.loadingData = false;
      }
    });
  }

  private setButtons() {
    if (this.dashboard.readOnly) {
      this.showAdd = false;
      this.showDelete = false;
      this.showSave = false;
      this.showSaveAs = false;
      this.showShare = false;

      return;
    }
    const userId = this.authQuery.getSnapshot().userDetails.userId;
    if (this.menuItem.name.startsWith(userId)) {
      // We are the owner of this menu Item
      // We can save changes and delete
      this.showAdd = true;
      this.showSave = true;
      this.showDelete = true;
      this.showShare = true;
    }

    this.showSaveAs = true;
  }

  onToolbarClicked(button: string) {
    switch (button) {
      case 'add': {
        this.galleryShown = !this.galleryShown;
        break;
      }
      case 'refresh': {
        break;
      }
      case 'remove': {
        this.deleteDashboard();
        break;
      }
      case 'saveas': {
        this.saveShown = true;
        break;
      }
      case 'save': {
        this.saveDashboard(null);
        break;
      }
      case 'share': {
        break;
      }
    }
  }

  private deleteDashboard() {
    this.confirmationService.confirm({
      message: this.translate.instant('Are you sure you wish to delete this Dashboard?'),
      accept: () => {
        this.menuService.delete(this.menuItem).subscribe(() => {

          this.router.navigateByUrl('/');
         });
       }
    });
  }

  private saveDashboard(saveDetails: SaveDetails) {
    // Create Clone of current Dashboard
    const clonedMenu: CoreMenuItem = JSON.parse(JSON.stringify(this.menuItem));

    clonedMenu.menuDetails = JSON.parse(JSON.stringify(this.dashboard));
    clonedMenu.roles = [];

    if (saveDetails) {
      clonedMenu.name = `${this.authQuery.getSnapshot().userDetails.userId}::${saveDetails.name}`;
      clonedMenu.parent = saveDetails.parentName;
      clonedMenu.label = saveDetails.label;
    } else {
      // this is the save (existing) function
    }

    clonedMenu.routerLink = `dashboard/${clonedMenu.name}`;

    // Mark as owned by current user
    clonedMenu.userIds = [this.authQuery.getSnapshot().userDetails.userId];

    this.menuService.saveMenuItem(clonedMenu);
    setTimeout(() => {
      this.notificationService.showMessage({ severity: 'info', summary: 'Save', detail: this.translate.instant('Dashboard Saved') })
    }, 1000);
  }

  onTitleChanged(newTitle: string) {
    this.dashboard.title = newTitle;
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

  onWidgetEvent(name: string, widgetDetails: WidgetDetails, instance: any) {
    switch (name) {
      case 'properties': {
        this.actionInputDefinition = widgetDetails.widget.inputBuilderDefinition;
        this.actionValues = widgetDetails.configuredValues;
        this.actionInputPopup.showPopup();
        break;
      }
      case 'refresh': {
        const item = instance as IDashboardItem;
        item.refreshData();
        break;
      }
      case 'remove': {
        this.dashboard.widgets.splice(this.dashboard.widgets.indexOf(widgetDetails), 1);
        break;
      }
    }
  }

  // Save As Bits
  onSaveMenu(savedMenu: SaveDetails) {
    if (savedMenu) {
      this.saveDashboard(savedMenu);
    }
    this.saveShown = false;
  }
  // Save As Bits

  actionOkClicked(model: any) {
    this.actionValues = model;

    alert('Clicked');
  }

  // User clicked Cancel
  actionCancelClicked() {
    alert('User Cancelled');
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
      minRows: 8,
      maxRows: 20,
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
}
