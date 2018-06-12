import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../core/services/menu/menu.service';
import { LoggingService } from '../../../core/services/logging/logging.service';
import { CoreMenuItem, GridViewDetail } from '@ngscaffolding/models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-datagrid-holder',
  templateUrl: './dataGridHolder.component.html',
  styles: ['./dataGridHolder.component.scss']
})
export class DataGridHolderComponent implements OnInit, OnDestroy {
  private paramSubscription: any;
  private menuItem: CoreMenuItem;

  public itemDetail: GridViewDetail;
  public itemId: string;

  constructor(private route: ActivatedRoute, private logger: LoggingService, private menuService: MenuService) {}

  ngOnInit(): void {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      const menuName = params['id'];

      // get Menu Items
      this.menuItem = this.menuService.getMenuItemByName(menuName);
      this.itemId = menuName;

      this.itemDetail = JSON.parse(this.menuItem.jsonSerialized) as GridViewDetail;
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
