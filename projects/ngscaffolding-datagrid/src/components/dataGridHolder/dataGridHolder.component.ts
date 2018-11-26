import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MenuService , LoggingService } from 'ngscaffolding-core';
import { CoreMenuItem, GridViewDetail } from '@ngscaffolding/models';

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

      this.itemDetail = this.menuItem.menuDetails as GridViewDetail;
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
