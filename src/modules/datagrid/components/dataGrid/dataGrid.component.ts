import {
  HostListener,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { GridOptions, ColDef, ColDefUtil } from 'ag-grid/main';

import {
  Action,
  CoreMenuItem,
  GridViewDetail,
  InputBuilderDefinition,
  DataSetResults
} from '@ngscaffolding/models';

import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

import {
  AppSettingsService,
  DataSourceService,
  MenuService,
  LoggingService,
  NotificationService,
  BroadcastService,
  UserPreferencesService,
  CacheService
} from '../../../core/coreModule';

import { FiltersHolderComponent } from '../filtersHolder/filtersHolder.component';
import { MenuItem } from 'primeng/primeng';
import { InputBuilderPopupComponent } from '../../../inputbuilder/inputbuilderModule';
import { ActionsHolderComponent } from '../actionsHolder/actionsHolder.component';
import { ActionService } from '../../../core/services/action/action.service';
import {
  ButtonCellComponent,
  ActionClickedData
} from '../../cellTemplates/buttonCell/buttonCell.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-data-grid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})
export class DataGridComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild(HTMLDivElement) gridArea: HTMLDivElement;
  @ViewChild(HTMLDivElement) gridSection: HTMLDivElement;
  @ViewChild(FiltersHolderComponent) filtersHolder: FiltersHolderComponent;
  @ViewChild(InputBuilderPopupComponent)
  actionInputPopup: InputBuilderPopupComponent;
  @ViewChild(ActionsHolderComponent) actionsHolder: ActionsHolderComponent;

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

  private gridviewPrefPrefix = 'GridViewPrefs_';

  private prefsSubscription: any;

  private clickedAction: Action;

  private broadcastSubscription: Subscription;

  private gridSavedState: any;

  constructor(
    private logger: LoggingService,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private actionService: ActionService,
    private appSettingsService: AppSettingsService,
    private dataSourceService: DataSourceService,
    private cacheService: CacheService,
    private menuService: MenuService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private broadcast: BroadcastService,
    private prefService: UserPreferencesService
  ) {
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,

      rowSelection: 'multiple',
      suppressCellSelection: true,

      onGridReady: () => {
        if (this.gridSavedState) {
          this.gridOptions.columnApi.setColumnState(this.gridSavedState);
        }
      }
    };
    // Wire up broadcast for action clicked
    this.broadcastSubscription = broadcast
      .on('ACTION_CLICKED')
      .subscribe(actionData => {
        const actionClickedData = actionData as ActionClickedData;
        this.actionClicked(actionClickedData.action, actionClickedData.row);
      });
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
    this.prefService
      .setValue(
        this.gridviewPrefPrefix + this.itemId,
        JSON.stringify(savedState)
      )
      .subscribe(
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
    this.prefService
      .deleteValue(this.gridviewPrefPrefix + this.itemId)
      .subscribe(
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

    this.dataSourceService
      .getData(
        {
          name: this.itemDetail.selectDataSourceName,
          filterValues: JSON.stringify(this.filterValues)
        },
        true
      )
      .subscribe(
        data => {
          this.rowData = JSON.parse(data.jsonData);
          if (data.rowCount) {
            this.rowCount = data.rowCount;
          }
        },
        error => {
          // Failed Select
          this.logger.error(error);

          this.notification.showMessage({
            detail: 'Unable to get data',
            severity: 'error'
          });
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
      if (
        this.itemDetail.actions &&
        this.itemDetail.actions.filter(action => action.columnButton).length > 0
      ) {
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
          field: column.Field,
          cellClass: column.CellClass,
          filter: column.Filter,
          tooltipField: column.TooltipField,
          headerName: column.HeaderName,
          headerTooltip: column.HeaderTooltip,
          pinned: column.Pinned,
          suppressMenu: column.SuppressMenu,
          suppressFilter: column.SuppressFilter,
          suppressSorting: column.SuppressSorting,

          type: column.Type,
          hide: column.Hide
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
    if (
      action.inputBuilderDefinition &&
      action.inputBuilderDefinition.inputDetails.length > 0
    ) {
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
      this.callAction(action);
    }
  }

  private callAction(action: Action) {
    this.actionService
      .callAction(action, this.actionValues, this.selectedRows)
      .subscribe(
        result => {
          if (result.success) {
            if (action.successMessage) {
              if (action.successToast) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: action.successMessage
                });
                if(action.flushDataSource) {
                  this.cacheService.resetValue(action.flushDataSource);
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

  //
  // User Cliecked OK on popup
  //
  actionOkClicked(model: any) {
    this.actionValues = model;

    // Setup call to service to run Action
    // Once Complete

    this.callAction(this.clickedAction);
  }

  // User clicked Cancel
  actionCancelClicked() {
    alert('User Cancelled');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadMenuItem();
  }

  ngOnInit(): void {
    // watch for Prefs changes
    this.prefsSubscription = this.prefService.preferenceValuesSubject.subscribe(
      prefs => {
        const pref = prefs.find(
          loopPref => loopPref.name === this.gridviewPrefPrefix + this.itemId
        );
        if (pref) {
          this.gridSavedState = JSON.parse(pref.value);
        }
      }
    );
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
