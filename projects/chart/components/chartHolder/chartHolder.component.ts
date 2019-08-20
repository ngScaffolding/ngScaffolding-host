import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { LoggingService, MenuQuery } from 'ngscaffolding-core';
import { CoreMenuItem, ChartDetailModel } from 'ngscaffolding-models';

@Component({
  selector: 'ngs-chart-holder',
  templateUrl: 'chartHolder.component.html',
  styleUrls: ['chartHolder.component.scss']
})
export class ChartHolderComponent implements OnInit, OnDestroy {
  private paramSubscription: any;
  private menuName: string;
  private menuItem: CoreMenuItem;

  public itemDetails: ChartDetailModel;

  constructor(private route: ActivatedRoute, private logger: LoggingService,
    private menuQuery: MenuQuery) {}

  ngOnInit(): void {
    // Get Menu Id
    this.paramSubscription = this.route.params.subscribe(params => {
      this.menuName = params['id'];

      // get Menu Item
      this.menuQuery.selectEntity(this.menuName).subscribe(menu => {
        this.menuItem = menu;
        this.itemDetails = this.menuItem.menuDetails as ChartDetailModel;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
