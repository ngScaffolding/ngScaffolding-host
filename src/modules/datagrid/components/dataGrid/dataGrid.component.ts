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
  ReferenceValuesService,
  MenuService,
  CoreMenuItem,
  LoggingService
} from '../../../core/coreModule';

import { GridViewDetail } from '../../models/gridViewDetail.model';
import { FiltersHolderComponent } from '../filtersHolder/filtersHolder.component';

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
    private referenceValuesService: ReferenceValuesService,
    private menuService: MenuService
  ) {
    this.gridOptions = <GridOptions>{};

    // this.columnDefs = [
    //   { headerName: 'Make', field: 'make' },
    //   {
    //     headerName: 'Model',
    //     field: 'model'
    //   },
    //   { headerName: 'Price', field: 'price' }
    // ];

    // this.rowData = [
    //   { make: 'Toyota', model: 'Celica', price: 35000 },
    //   { make: 'Ford', model: 'Mondeo', price: 32000 },
    //   { make: 'Porsche', model: 'Boxter', price: 72000 }
    // ];
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

  private loadMenuItem(menuName: string) {
    this.menuItem = null;

    this.menuItems.forEach(loopMenuItem => {
      if (loopMenuItem.name === menuName) {
        this.menuItem = loopMenuItem;
      }
    });

    if(this.menuItem)
    {
      this.logger.info(`dataGrid Loaded menu ${menuName}`);
    }
  }

  ngOnInit(): void {
    this.menuSubscription = this.menuService.menuSubject.subscribe(menuItems => {
      this.menuItems = menuItems;
    }
    );
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];
      if (this.menuName) {
        this.loadMenuItem(this.menuName);
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
