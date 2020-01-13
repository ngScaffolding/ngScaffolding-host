import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  LoggingService,
  MenuQuery,
  WidgetQuery,
  AppSettingsQuery,
  MenuService,
  UserAuthenticationQuery,
  NotificationService,
  SpinnerService
} from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CoreMenuItem,
  WidgetDetails,
  InputBuilderDefinition,
  IDashboardItem,
  InputLocations
} from 'ngscaffolding-models';

import { DashboardModel } from 'ngscaffolding-models';

import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
  GridsterItemComponent,
  GridsterItemComponentInterface
} from 'angular-gridster2';
import { InputBuilderPopupComponent } from 'ngscaffolding-inputbuilder';
import { SaveDetails } from '../saveInput/saveInput.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, interval, combineLatest, Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'ngs-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChildren(GridsterItemComponent) gridsterItems: QueryList<GridsterItemComponent>;
  @ViewChild('actionInputPopup', { static: false }) actionInputPopup: InputBuilderPopupComponent;
  @ViewChild('dashboardInputPopup', { static: false }) dashboardInputPopup: InputBuilderPopupComponent;

  private paramSubscription: any;

  private mouseX: number;
  private mouseY: number;

  private menuName: string;
  menuItem: CoreMenuItem;

  public options: GridsterConfig;
  public dashboard: DashboardModel;
  public isShareDialog = false;

  // toolbar visible
  public showSave = false;
  public showSaveAs = false;
  public showAdd = false;
  public showDelete = false;
  public showShare = false;
  public showInput = false;

  private components: any[] = [];

  // Refresh Observable
  private refreshSubscription: Subscription = null;

  // Hold widget we are configuring when input details clicked
  private widgetInstanceConfigured: IDashboardItem;
  private widgetDetailsConfigured: WidgetDetails;

  // Input Details
  actionInputDefinition: InputBuilderDefinition;
  actionValues: any;

  // Save As Bits
  saveShown = false;

  public componentInputs = {};

  public unitHeight: number;
  public galleryShown = false;

  public inputModel: object = {};

  // Show/Hide Dashboard Input Details
  public dashboardInputShown = false;

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
      private menuService: MenuService,
      private spinner: SpinnerService
  ) {}

  public getComponent(widgetDetails: WidgetDetails) {}

  private setAllRefresh() {
      // Drop existing subscription
      if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
      }
      if (this.dashboard.refreshInterval) {
          this.refreshSubscription = interval(this.dashboard.refreshInterval * 1000).subscribe(() => {
              this.logger.info('Refreshing all Widgets');
              this.refreshAll();
          });
      }
  }

  loadDashboard() {
      this.spinner.showSpinner('Loading');

      this.menuQuery.selectEntity(this.menuName).subscribe(menuItem => {
          if (menuItem) {
              this.menuItem = JSON.parse(JSON.stringify(menuItem));

              if (this.menuItem && this.menuItem.menuDetails) {
                  this.dashboard = this.menuItem.menuDetails as DashboardModel;
              }

              this.setButtons();

              this.setAllRefresh();

              const userId = this.authQuery.getValue().userDetails.userId;

              // Readonly means no moving!
              if (this.dashboard.readOnly) {
                this.options.draggable = {enabled: false};
                this.options.resizable = {enabled: false};
              } else if (this.menuItem.name.startsWith(userId)) {
                this.options.draggable = {enabled: true};
                this.options.resizable = {enabled: true};
              } else {
                this.options.draggable = {enabled: false};
                this.options.resizable = {enabled: false};
              }

              this.spinner.hideSpinner();
          }
      });
  }

  private setButtons() {
      // Default = Computer says no
      this.showAdd = false;
      this.showDelete = false;
      this.showSave = false;
      this.showSaveAs = false;
      this.showShare = false;
      this.showInput = false;

      const userId = this.authQuery.getValue().userDetails.userId;
      if (this.menuItem.name.startsWith(userId)) {
          // We are the owner of this menu Item
          // We can save changes and delete
          this.showAdd = true;
          this.showSave = true;
          this.showDelete = true;
          this.showShare = true;
      }

      // Check to see if the Dashboard is configurable
      if (
          this.dashboard.inputBuilderDefinition &&
          this.dashboard.inputBuilderDefinition.inputLocation !== InputLocations.INLINE &&
          this.dashboard.inputBuilderDefinition.inputDetails
      ) {
          // Dont Show the input button if we have inline inputs
          this.showInput = true;
      }

      this.showSaveAs = true;
  }

  onToolbarClicked(button: string) {
      switch (button) {
          case 'add': {
              this.galleryShown = !this.galleryShown;
              break;
          }
          case 'input': {
              // this.dashboardInputShown = !this.dashboardInputShown;
              if (!this.dashboard.configuredValues) {
                  this.dashboard.configuredValues = {};
              }
              this.inputModel = this.dashboard.configuredValues;
              this.dashboardInputPopup.showPopup();
              break;
          }
          case 'refresh': {
              this.refreshAll();
              break;
          }
          case 'remove': {
              this.deleteDashboard();
              break;
          }
          case 'saveas': {
              this.isShareDialog = false;
              this.saveShown = true;
              break;
          }
          case 'save': {
              this.saveDashboard(null);
              break;
          }
          case 'share': {
              this.isShareDialog = true;
              this.saveShown = true;
              break;
          }
      }
  }

  private refreshAll() {
      this.components.forEach(comp => {
          const component = comp as IDashboardItem;
          if (typeof component.refreshData === 'function') {
              // safe to use the function
              component.refreshData();
          }
      });
  }

  private deleteDashboard() {
      this.confirmationService.confirm({
          message: this.translate.instant('Are you sure you wish to delete this Dashboard?'),
          accept: () => {
              this.menuService.delete(this.menuItem).subscribe(() => {
                  setTimeout(() => {
                      this.notificationService.showMessage({
                          severity: 'info',
                          summary: 'Delete',
                          detail: this.translate.instant('Dashboard Deleted')
                      });
                  }, 1000);

                  this.router.navigateByUrl('/');
              });
          }
      });
  }

  private shareDashboard(saveDetails: SaveDetails) {
      // Create Clone of current Dashboard
      const clonedMenu: CoreMenuItem = { ...this.menuItem };

      clonedMenu.menuDetails = { ...this.dashboard };
      clonedMenu.roles = [saveDetails.shareRole];

      clonedMenu.name = `${saveDetails.label}::${Date.now()}`;
      clonedMenu.parent = saveDetails.parentName;
      clonedMenu.label = saveDetails.label;

      clonedMenu.routerLink = `dashboard/${clonedMenu.name}`;

      // Mark as NOT owned by current user
      clonedMenu.userIds = null;

      this.saveMenuItemToService(clonedMenu, 'Share', 'Dashboard Shared');
  }

  private saveDashboard(saveDetails: SaveDetails) {
      // Create Clone of current Dashboard
      const clonedMenu: CoreMenuItem = { ...this.menuItem };

      clonedMenu.menuDetails = { ...this.dashboard };
      clonedMenu.roles = [];

      if (saveDetails) {
          // this is the save AS function
          clonedMenu.name = `${this.authQuery.getValue().userDetails.userId}::${saveDetails.label}::${Date.now()}`;
          clonedMenu.parent = saveDetails.parentName;
          clonedMenu.label = saveDetails.label;

          clonedMenu.routerLink = `dashboard/${clonedMenu.name}`;

          // Mark as owned by current user
          clonedMenu.userIds = [this.authQuery.getValue().userDetails.userId];
      }

      this.saveMenuItemToService(clonedMenu, 'Save', 'Dashboard Saved');
  }

  /// Save our menu Item but keep the configured widget details for menu stuffing.
  private saveMenuItemToService(menuItem: CoreMenuItem, summary: string, result: string) {
      const clonedFullMenu = { ...menuItem };

      // Clear down the widget details for saving
      const dashboardModel: CoreMenuItem = { ...menuItem };
      (<DashboardModel>dashboardModel.menuDetails).widgets.forEach(dashboardWidget => {
          dashboardWidget['component'] = null;
          dashboardWidget.widget = null;
      });

      this.menuService.saveMenuItem(dashboardModel, false);
      setTimeout(() => {
          // this.menuService.updateExistingMenuItem(clonedFullMenu);
          this.menuService.addMenuItems([clonedFullMenu]);
          this.notificationService.showMessage({
              severity: 'info',
              summary: this.translate.instant(summary),
              detail: this.translate.instant(result)
          });
      }, 200);
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

  // Component Here is our HTML Angular Element
  public componentCreated(widget: WidgetDetails, component: any) {
      widget['component'] = component;
      component['widget'] = widget;
      this.components.push(component);
  }

  onWidgetEvent(name: string, widgetDetails: WidgetDetails) {
      const instance = widgetDetails['component'] as IDashboardItem;
      switch (name) {
          case 'properties': {
              this.actionInputDefinition = widgetDetails.widget.inputBuilderDefinition;
              this.actionValues = widgetDetails.configuredValues || {};

              this.actionInputPopup.showPopup();
              this.widgetInstanceConfigured = instance;
              this.widgetDetailsConfigured = widgetDetails;
              break;
          }
          case 'refresh': {
              if (typeof instance.refreshData === 'function') {
                  instance.refreshData();
              }
              break;
          }
          case 'remove': {
              this.dashboard.widgets.splice(this.dashboard.widgets.indexOf(widgetDetails), 1);
              break;
          }
      }
  }

  // Save As Bits and sharing
  onSaveMenu(savedMenu: SaveDetails) {
      if (savedMenu) {
          if (this.isShareDialog) {
              this.shareDashboard(savedMenu);
          } else {
              this.saveDashboard(savedMenu);
          }
      }
      this.saveShown = false;
  }

  // Input Details for Widget
  actionOkClicked(model: any) {
      this.actionValues = model[0];

      this.widgetDetailsConfigured.configuredValues = model;
      // Copy in Dashboard values first
      this.widgetInstanceConfigured.updateData({ ...this.dashboard.configuredValues, ...model });
      this.widgetInstanceConfigured.refreshData();
      this.actionInputPopup.isShown = false;

      // Reset widget selection
      this.widgetInstanceConfigured = null;
      this.widgetDetailsConfigured = null;
  }

  // User clicked Cancel
  actionCancelClicked() {}

  // User Provided Input for the Top Dashboard
  dashInputOkClicked(model: any) {
      // Save for future
      this.dashboard.configuredValues = model;

      this.components.forEach(comp => {
          const dashItem = comp as IDashboardItem;
          const oldConfigValues = comp.widget.configuredValues;

          // Add in updated Dashboard Input (Copy overwrites old bits)
          if (typeof dashItem.updateData === 'function') {
              dashItem.updateData({ ...oldConfigValues, ...model });
          }
          if (typeof dashItem.refreshData === 'function') {
              dashItem.refreshData();
          }
      });
      this.dashboardInputPopup.isShown = false;
  }

  // User clicked Cancel
  dashInputCancelClicked() {}

  ngOnChanges(changes: SimpleChanges): void {
      if (this.gridsterItems && this.gridsterItems.length > 0 && this.gridsterItems[0].gridster.curRowHeight > 1) {
          this.unitHeight = this.gridsterItems[0].gridster.curRowHeight;
      }
  }

  ngOnInit() {
      this.options = {
          itemChangeCallback: this.itemChange,
          itemResizeCallback: this.itemResize.bind(this),

          gridType: GridType.Fit,
          compactType: CompactType.None,
          margin: 10,
          outerMargin: false,
          outerMarginTop: null,
          outerMarginRight: null,
          outerMarginBottom: null,
          outerMarginLeft: null,
          mobileBreakpoint: 640,
          minCols: 24,
          maxCols: 24,
          minRows: 8,
          maxRows: 8,
          maxItemCols: 100,
          minItemCols: 1,
          maxItemRows: 100,
          minItemRows: 1,
          maxItemArea: 2500,
          minItemArea: 1,
          defaultItemCols: 1,
          defaultItemRows: 1,
          keepFixedHeightInMobile: false,
          keepFixedWidthInMobile: true,
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

      // Get Menu Id
      this.paramSubscription = this.route.params.subscribe(params => {
          this.menuName = params['id'];
          this.loadDashboard();
      });
  }

  ngOnDestroy(): void {
      if (this.paramSubscription) {
          this.paramSubscription.unsubscribe();
      }
      if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
      }
  }

  changedOptions() {
      this.options.api.optionsChanged();
  }
}
