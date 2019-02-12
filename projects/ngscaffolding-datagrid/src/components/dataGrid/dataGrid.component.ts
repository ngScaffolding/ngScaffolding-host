import { HostListener, Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions, ColDef, ColDefUtil } from 'ag-grid/main';

import { Action, CoreMenuItem, GridViewDetail, InputBuilderDefinition, DataResults, DialogOptions, IDashboardItem } from '@ngscaffolding/models';

import { ConfirmationService } from 'primeng/primeng';
import { Dialog } from 'primeng/dialog';
import { MessageService } from 'primeng/components/common/messageservice';

import {
  ActionService,
  AppSettingsService,
  DataSourceService,
  MenuService,
  LoggingService,
  NotificationService,
  BroadcastService,
  UserPreferencesService,
  CacheService
} from 'ngscaffolding-core';

import { FiltersHolderComponent } from '../filtersHolder/filtersHolder.component';
import { InputBuilderPopupComponent } from 'ngscaffolding-inputbuilder';
import { ActionsHolderComponent } from '../actionsHolder/actionsHolder.component';
import { ButtonCellComponent, ActionClickedData } from '../../cellTemplates/buttonCell/buttonCell.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngs-data-grid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})
export class DataGridComponent implements IDashboardItem, OnInit, OnDestroy, OnChanges {
  // @ViewChild(HTMLDivElement) gridArea: HTMLDivElement;
  // @ViewChild(HTMLDivElement) gridSection: HTMLDivElement;
  @ViewChild(FiltersHolderComponent) filtersHolder: FiltersHolderComponent;
  @ViewChild(InputBuilderPopupComponent) actionInputPopup: InputBuilderPopupComponent;
  @ViewChild(ActionsHolderComponent) actionsHolder: ActionsHolderComponent;
  @ViewChild(Dialog) dialog;

  @Input() isWidget: boolean;
  @Input() itemId: string;
  @Input() itemDetail: GridViewDetail;

  filterValues: any;
  filters: InputBuilderDefinition;

  actions: Action[];
  actionInputDefinition: InputBuilderDefinition;
  actionValues: any;

  gridOptions: GridOptions;
  selectedRows: any[];
  columnDefs: any[];
  rowData: any[];
  rowCount: number;
  hideLabels = true;

  showFilters = true;
  showToolPanel = false;

  // Show spinner when loading
  dataLoading: boolean;

  // Dialog Settings
  popupShown = false;
  dialogOptions: DialogOptions = {};

  private gridviewPrefPrefix = 'GridViewPrefs_';

  private prefsSubscription: any;

  private clickedAction: Action;

  private broadcastSubscription: Subscription;

  private gridSavedState: any;

  constructor(
    private router: Router,
    private logger: LoggingService,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private actionService: ActionService,
    private appSettingsService: AppSettingsService,
    private dataSourceService: DataSourceService,
    private cacheService: CacheService,
    private menuService: MenuService,
    private broadcast: BroadcastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private prefService: UserPreferencesService
  ) {
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      groupMultiAutoColumn: true,
      rowGroupPanelShow: 'always',

      rowSelection: 'multiple',
      suppressCellSelection: true,

      onGridReady: () => {
        if (this.gridSavedState) {
          this.gridOptions.columnApi.setColumnState(this.gridSavedState);
        }
      }
    };
    // Wire up broadcast for action clicked
    this.broadcastSubscription = this.broadcast.on('ACTION_CLICKED').subscribe(actionData => {
      const actionClickedData = actionData as ActionClickedData;
      this.actionClicked(actionClickedData.action, actionClickedData.row);
    });
  }

  public refreshData() {
    this.loadInitialData();
  }

  // Toolbar Operations
  showHideFilters() {
    this.showFilters = !this.showFilters;
  }
  showHideColumns() {
    this.showToolPanel = !this.showToolPanel;

    this.gridOptions.api.showToolPanel(this.showToolPanel);
  }
  exportData() {}
  saveView() {
    const savedState = this.gridOptions.columnApi.getColumnState();
    this.prefService.setValue(this.gridviewPrefPrefix + this.itemId, JSON.stringify(savedState)).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'View Saved'
        });
      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'View not Saved'
        });
      }
    );
  }
  resetView() {
    // Remove our saved settings
    this.prefService.deleteValue(this.gridviewPrefPrefix + this.itemId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'View Reset'
        });
        this.loadMenuItem();
      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'View not Reset'
        });
      }
    );
  }
  shareView() {}
  // Toolbar Operations

  onGridReady(params) {
    // params.api.sizeColumnsToFit();
  }

  onFiltersUpdated(filters) {
    this.filterValues = filters;

    this.loadInitialData();
  }

  onSelectionChanged($event) {
    this.selectedRows = this.gridOptions.api.getSelectedRows();
    this.actionsHolder.selectedRows = this.selectedRows;
    this.actionsHolder.selectedRowsCount = this.selectedRows.length;
  }

  selectAllRows() {
    // this.gridOptions.api.selectAll();
  }

  // Load First Data and if any criteria Changes
  public loadInitialData() {
    this.rowData = [];

    this.dataLoading = true;

    this.dataSourceService.getDataSource({ name: this.itemDetail.selectDataSourceName, filterValues: JSON.stringify(this.filterValues) }).subscribe(
      results => {
        if (!results.inflight) {
          if (results.jsonData) {
            this.rowData = JSON.parse(results.jsonData);
            if (results.rowCount) {
              this.rowCount = results.rowCount;
            }
          }
          this.dataLoading = false;
        }
      },
      err => {
        alert('err');
      }
    );
  }

  private loadMenuItem() {
    if (this.itemDetail) {
      this.columnDefs = [];
      this.filters = this.itemDetail.filters;

      // Do We need a Checkbox
      if (!this.itemDetail.disableCheckboxSelection) {
        // Switch off RowSelection
        this.gridOptions.suppressRowClickSelection = true;

        // Add the selection column
        this.columnDefs.push({
          width: 70,
          suppressMenu: true,
          suppressFilter: true,
          suppressSorting: true,
          checkboxSelection: true,
          pinned: 'left',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: false
        });
      }

      // Do We need an Actions button
      if (this.itemDetail.actions && this.itemDetail.actions.filter(action => action.columnButton).length > 0) {
        this.columnDefs.push({
          headerName: 'Actions',
          suppressMenu: true,
          suppressFilter: true,
          suppressSorting: true,
          field: 'Id',
          cellRendererFramework: ButtonCellComponent,
          cellRendererParams: {
            actions: this.itemDetail.actions,
            splitButton: this.itemDetail.isActionColumnSplitButton
          }
        });
      }

      this.itemDetail.columns.forEach(column => {
        const colDef: ColDef = {
          field: column.field,
          cellClass: <string>column.cellClass,
          filter: column.filter,
          tooltipField: column.tooltipField,
          headerName: column.headerName,
          headerTooltip: column.headerTooltip,
          pinned: column.pinned,
          suppressMenu: column.suppressMenu,
          suppressFilter: column.suppressFilter,
          suppressSorting: column.suppressSorting,
          enableRowGroup: true,

          type: column.type,
          hide: column.hide
        };

        this.columnDefs.push(colDef);
      });

      // Actions Here
      this.actions = this.itemDetail.actions;
    }

    this.loadInitialData();
  }

  //
  // Action Stuff
  //
  actionClicked(action: Action, row: any) {
    // check if we need confirmation
    if (action.confirmationMessage) {
      this.confirmationService.confirm({
        message: action.confirmationMessage,
        header: 'Confirmation',
        accept: () => {
          this.checkForActionInputs(action, row);
        }
      });
    } else {
      // Just do it without asking
      this.checkForActionInputs(action, row);
    }
  }

  private checkForActionInputs(action: Action, row: any) {
    if (action.inputBuilderDefinition && action.inputBuilderDefinition.inputDetails.length > 0) {
      this.clickedAction = action;
      this.actionInputDefinition = action.inputBuilderDefinition;
      if (row) {
        this.actionValues = row;
      } else {
        this.actionValues = {};
      }
      this.actionInputPopup.showPopup();
    } else {
      this.actionValues = {};
      this.callAction(action, row);
    }
  }

  private callAction(action: Action, row: any) {
    switch (action.type.toLowerCase()) {
      case 'angularroute': {
        this.router
          .navigate([{ outlets: { popup: [action.angularRoute] } }], { queryParams: row, skipLocationChange: true, relativeTo: this.route })
          .then(res => {
            // Use the options from our action
            if (action.dialogOptions) {
              this.dialogOptions = action.dialogOptions;
            } else {
              this.dialogOptions = {};
            }
            this.popupShown = true;

            // Center Popup here
            window.setTimeout(() => {
              this.dialog.center();
            });
          })
          .catch(err => {
            this.confirmationService.confirm({
              message: `Unable to navigate route: ${action.angularRoute}`,
              icon: 'fa-close',
              acceptLabel: 'OK',
              header: 'Error',
              rejectVisible: false
            });
          });

        break;
      }
      default: {
        this.actionService.callAction(action, this.actionValues, this.selectedRows).subscribe(
          result => {
            if (result.success) {
              if (action.successMessage) {
                if (action.successToast) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: action.successMessage
                  });
                  if (action.flushReferenceValues) {
                    this.cacheService.resetValue('referenceValue::' + action.flushReferenceValues + '::');
                  }
                } else {
                  this.confirmationService.confirm({
                    message: action.successMessage,
                    acceptLabel: 'OK',
                    icon: 'fa-check',
                    header: 'Success',
                    rejectVisible: false
                  });
                }
              }
              // finally
              this.actionInputPopup.isShown = false;

              // Refresh Data
              this.loadInitialData();
            } else {
              if (action.errorMessage) {
                this.confirmationService.confirm({
                  message: action.errorMessage,
                  icon: 'fa-close',
                  acceptLabel: 'OK',
                  header: 'Error',
                  rejectVisible: false
                });
              }
            }
          },
          err => {
            if (action.errorMessage) {
              this.confirmationService.confirm({
                message: action.errorMessage,
                icon: 'fa-close',
                acceptLabel: 'OK',
                header: 'Error',
                rejectVisible: false
              });
            }
          }
        );
      }
    }
  }

  //
  // User Cliecked OK on popup
  //
  actionOkClicked(model: any) {
    this.actionValues = model;

    // Setup call to service to run Action
    // Once Complete

    this.callAction(this.clickedAction, model);
  }

  // User clicked Cancel
  actionCancelClicked() {
    alert('User Cancelled');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemDetail && changes.itemDetail.currentValue) {
      this.loadMenuItem();
    }
  }

  ngOnInit(): void {
    // watch for Prefs changes
    this.prefsSubscription = this.prefService.preferenceValuesSubject.subscribe(prefs => {
      if (prefs) {
        const pref = prefs.find(loopPref => loopPref.name === this.gridviewPrefPrefix + this.itemId);
        if (pref) {
          this.gridSavedState = JSON.parse(pref.value);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.broadcastSubscription) {
      this.broadcastSubscription.unsubscribe();
    }
    if (this.prefsSubscription) {
      this.prefsSubscription.unsubscribe();
    }
  }
}
