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
import { GridOptions } from 'ag-grid/main';

import {
  AppSettingsService,
  DataSourceService,
  MenuService,
  CoreMenuItem,
  LoggingService
} from '../../../core/coreModule';

import { GridViewDetail } from '../../models/gridViewDetail.model';
import { FiltersHolderComponent } from '../filtersHolder/filtersHolder.component';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'data-grid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})
export class DataGridComponent implements OnInit, OnDestroy {
  @ViewChild(FiltersHolderComponent) filtersHolder: FiltersHolderComponent;

  @Input() gridViewDetail: GridViewDetail;

  menuItem: CoreMenuItem;
  filterValues: any;
  gridOptions: GridOptions;
  columnDefs: any[];
  rowData: any[];

  private menuName: string;
  private menuItems: CoreMenuItem[];

  private paramSubscription: any;
  private menuSubscription: any;

  constructor(
    private logger: LoggingService,
    private route: ActivatedRoute,
    private appSettingsService: AppSettingsService,
    private dataSourceService: DataSourceService,
    private menuService: MenuService
  ) {
    this.gridOptions = <GridOptions>{};

  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  onFiltersUpdated(filters) {
    this.filterValues = filters;
    this.loadInitialData();
  }

  selectAllRows() {
    this.gridOptions.api.selectAll();
  }

  // Load First Data and if any criteria Changes
  private loadInitialData() {}

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

      this.findMenuItem(this.menuName, this.menuItems);

      if (this.menuItem && this.menuItem.jsonSerialized) {
          this.logger.info(`dataGrid Loading menu ${this.menuName}`);

          this.gridViewDetail = JSON.parse(this.menuItem.jsonSerialized) as GridViewDetail;
      }
    }
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

      if (this.menuName && !this.menuItem) {
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
