import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataSourceService, LoggingService, MenuService } from '../../../core/services';
import { Router } from '@angular/router';
import { CoreMenuItem } from '@ngscaffolding/models';
import { Observable } from 'rxjs/Observable';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styles: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  static itemChange(item, itemComponent) {
    console.log('itemChanged', item, itemComponent);
  }

  static itemResize(item, itemComponent) {
    console.log('itemResized', item, itemComponent);
  }

  ngOnInit() {
    this.options = {
      displayGrid: true,
      itemChangeCallback: DashboardComponent.itemChange,
      itemResizeCallback: DashboardComponent.itemResize,
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2}
    ];
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({});
  }
}
