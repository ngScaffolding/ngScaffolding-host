import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { GridOptions, ColDef, ColDefUtil } from 'ag-grid/main';

import {
  AppSettingsService,
  DataSourceService,
  MenuService,
  CoreMenuItem,
  LoggingService,
  NotificationService
} from '../../../core/coreModule';

import { GridViewDetail } from '../../models/gridViewDetail.model';
import { FiltersHolderComponent } from '../filtersHolder/filtersHolder.component';
import { DataSetResults } from '../../../core/models/datasetResults.model';
import { MenuItem } from 'primeng/primeng';
import { InputBuilderDefinition, InputBuilderPopupComponent } from '../../../inputbuilder/inputbuilderModule';
import { ActionModel } from '../../models';
import { ActionsHolderComponent } from '../actionsHolder/actionsHolder.component';

@Component({
  selector: 'data-grid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})
export class DataGridComponent implements OnInit, OnDestroy {
  @ViewChild(FiltersHolderComponent) filtersHolder: FiltersHolderComponent;
  @ViewChild(InputBuilderPopupComponent) actionInputPopup: InputBuilderPopupComponent;
  @ViewChild(ActionsHolderComponent) actionsHolder: ActionsHolderComponent;

  @Input() gridViewDetail: GridViewDetail;

  menuItem: CoreMenuItem;
  filterValues: any;
  filters: InputBuilderDefinition;

  actions: ActionModel[];
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

  private menuName: string;
  private menuItems: CoreMenuItem[];

  private paramSubscription: any;
  private menuSubscription: any;

  constructor(
    private logger: LoggingService,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private appSettingsService: AppSettingsService,
    private dataSourceService: DataSourceService,
    private menuService: MenuService
  ) {
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,

      rowSelection: 'multiple',
      suppressCellSelection: true,

      onGridReady: () => {}
    };

  }

  // Toolbar Operations
  showHideFilters() {
    this.showFilters = !this.showFilters;
  }
  showHideColumns() {
    this.showToolPanel = !this.showToolPanel;

    this.gridOptions.api.showToolPanel(this.showToolPanel)
  }
  exportData() {

  }
  saveView(){}
  resetView(){}
  shareView(){}
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
  private loadInitialData() {
    this.rowData = [];

    this.dataSourceService.getData({
      id: this.gridViewDetail.SelectDataSourceId,
      filterValues: JSON.stringify(this.filterValues)
    }, true)
    .subscribe(data => {
      this.rowData = JSON.parse(data.jsonData);
      if (data.rowCount) {
        this.rowCount = data.rowCount;
      }
    }, error => {
      // Failed Select
      this.logger.error(error);

      this.notification.showMessage({detail: 'Unable to get data', severity: 'error'});
    });
  }

  private findMenuItem(name: string, menuItems: CoreMenuItem[]) {
    if (menuItems) {
      menuItems.forEach(menuItem => {
         this.findMenuItem(name, menuItem.items as CoreMenuItem[]);
         if (menuItem.name && menuItem.name.toLowerCase() === name.toLowerCase()) {
            this.menuItem = menuItem;
        }
      });
    }
  }

  private loadMenuItem() {
    if (this.menuName && this.menuItems && this.menuItems.length > 0) {

      // Clear Existing Filters
      this.filters = {};

      this.findMenuItem(this.menuName, this.menuItems);

      if (this.menuItem && this.menuItem.jsonSerialized) {
          this.logger.info(`dataGrid Loading menu ${this.menuName}`);

          this.gridViewDetail = JSON.parse(this.menuItem.jsonSerialized) as GridViewDetail;

          if (this.gridViewDetail) {
            this.columnDefs = [];
            this.filters = this.gridViewDetail.Filters;
           if(!this.gridViewDetail.DisableCheckboxSelection){
            this.columnDefs.push({
              headerName: 'Selection',
              checkboxSelection: true,
              pinned: 'left',
              headerCheckboxSelection: true,
              headerCheckboxSelectionFilteredOnly: false
            });
           }
            this.gridViewDetail.Columns.forEach(column => {
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
            this.actions = this.gridViewDetail.Actions;
          }

          this.loadInitialData();
      }
    }
  }

  //
  // Action Stuff
  //
  actionClicked(action: ActionModel){
    if (action.inputBuilderDefinition && action.inputBuilderDefinition.inputDetails.length > 0) {
      this.actionInputDefinition = action.inputBuilderDefinition;
      this.actionInputPopup.showPopup();
    }
  }

  //
  // User Cliecked OK on popup
  //
  actionOkClicked(model: any) {
    this.actionValues = model;

    // Setup call to service to run Action

    // Once Complete
  }

  // User clicked Cancel
  actionCancelClicked() {
    alert('User Cancelled');
  }


  ngOnInit(): void {
    this.menuSubscription = this.menuService.menuSubject.subscribe(
      menuItems => {
        this.menuItems = menuItems;

        if (this.menuItems && this.menuItems.length > 0 && !this.menuItem) {
          this.loadMenuItem();
        }
      }
    );
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];

      if (this.menuName && !this.menuItem || this.menuName !== this.menuItem.name) {
        this.loadMenuItem();
      }
    });
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }
}
