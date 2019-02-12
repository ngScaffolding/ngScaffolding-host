import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';
import { InputBuilderDefinition, InputDetail, InputDetailTextBox, InputTypes } from '@ngscaffolding/models';

@Component({
  selector: 'app-workitem-details',
  templateUrl: 'workItemDetails.component.html',
  styleUrls: ['workItemDetails.component.scss']
})
export class WorkItemDetailsComponent  {

  private workItemId: string;
  public workItem: any;

  public mainInput: InputBuilderDefinition = {
    inputDetails: [
      <InputDetailTextBox>{ name: 'title', type: InputTypes.textbox, label: 'Item Title' },
      <InputDetailTextBox>{ name: 'client.name', type: InputTypes.textbox, label: 'Client Name' }
    ]
  };

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {
      this.workItemId = params['_id'];

      this.dataSource.getDataSource({name: 'FieldForce.WorkItems.Details', inputData: JSON.stringify({_id: this.workItemId}) })
        .subscribe(results => {
          if (!results.inflight) {
            this.workItem = JSON.parse(results.jsonData);
          }
      });

    });
  }
}
