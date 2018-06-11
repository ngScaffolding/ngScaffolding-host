import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../core/services/menu/menu.service';
import { LoggingService } from '../../../core/services/logging/logging.service';
import { CoreMenuItem } from '@ngscaffolding/models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chart-holder',
  templateUrl: 'chartHolder.component.html',
  styles: ['chartHolder.component.scss']
})
export class ChartHolderComponent implements OnInit, OnDestroy {
  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  constructor(private route: ActivatedRoute, private logger: LoggingService, private menuService: MenuService) {}

  ngOnInit(): void {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];
      this.menuItem = this.menuService.getMenuItemByName(this.menuName);
      // get Menu Items
      // this.loadChart();
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
