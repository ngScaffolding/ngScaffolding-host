import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { MenuService , LoggingService } from 'ngscaffolding-core';
import { CoreMenuItem, ChartDetailModel } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart-holder',
  templateUrl: 'chartHolder.component.html',
  styles: ['chartHolder.component.scss']
})
export class ChartHolderComponent implements OnInit, OnDestroy {
  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  public itemDetails: ChartDetailModel;

  constructor(private route: ActivatedRoute, private logger: LoggingService, private menuService: MenuService) {}

  ngOnInit(): void {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];

      // get Menu Items
      this.menuItem = this.menuService.getMenuItemByName(this.menuName);

      this.itemDetails = this.menuItem.menuDetails as ChartDetailModel;
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
