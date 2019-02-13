import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSourceService, BroadcastService, BroadcastTypes, NotificationService } from 'ngscaffolding-core';
import { InputBuilderDefinition, InputDetail, InputDetailTextBox, InputTypes, OrientationValues, InputDetailTextArea, Action } from '@ngscaffolding/models';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workitem-details',
  templateUrl: 'workItemDetails.component.html',
  styleUrls: ['workItemDetails.component.scss']
})
export class WorkItemDetailsComponent implements AfterViewInit {
  private workItemId: string;
  public workItem: any;

  private dirtyData = false;

  public mainInput: InputBuilderDefinition = {
    orientation: OrientationValues.Horizontal,
    columnCount: 3,

    inputDetails: [
      { name: 'title', type: InputTypes.textbox, label: 'Item Title' },
      { name: 'workOrderNo', type: InputTypes.textbox, label: 'Work Order No' },
      <InputDetailTextArea>{ name: 'surveyDetails', type: InputTypes.textarea, rows: 2, label: 'Survey Description' },

      // { name: 'client.name', type: InputTypes.textbox, label: 'Client Name' },
      { name: 'dateReceived', type: InputTypes.datetime, label: 'Date Received' },
      { name: 'dateConfirmed', type: InputTypes.datetime, label: 'Date Confirmed' },
      { name: 'datePlanned', type: InputTypes.datetime, label: 'Date Planned' },
      { name: 'dateCompleted', type: InputTypes.datetime, label: 'Date Completed' }
    ]
  };

  public datesInput: InputBuilderDefinition = {
    orientation: OrientationValues.Horizontal,
    columnCount: 3,

    inputDetails: [
      { name: 'dateReceived', type: InputTypes.datetime, label: 'Date Received' },
      { name: 'dateConfirmed', type: InputTypes.datetime, label: 'Date Confirmed' },
      { name: 'datePlanned', type: InputTypes.datetime, label: 'Date Planned' },
      { name: 'dateCompleted', type: InputTypes.datetime, label: 'Date Completed' }
    ]
  };

  constructor(private route: ActivatedRoute, private dataSource: DataSourceService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private notification: NotificationService,
    private broadcast: BroadcastService) { }

  saveWorkItem() {
    this.dataSource
      .getDataSource({
        name: 'FieldForce.WorkItems.Save',
        forceRefresh: true,
        body: this.workItem
      })
      .subscribe(result => {
        if (!result.inflight) {
          this.notification.showMessage({
            severity: 'success',
            summary: 'Saved',
            detail: 'Work Item Saved'
          });
          setTimeout(() => {
            this.broadcast.broadcast(BroadcastTypes.CLOSE_POPUP, { saved: true });
          }, 500);
        }
      });
  }
  cancelWorkItem() {
    if (this.dirtyData) {
      this.confirmationService.confirm({
        message: this.translate.instant('You have unsaved changes, do you wish to close?'),
        accept: () => {
          this.broadcast.broadcast(BroadcastTypes.CLOSE_POPUP, { saved: false });
        }
      });
    } else {
      this.broadcast.broadcast(BroadcastTypes.CLOSE_POPUP, { saved: false });
    }
  }

  valueUpdated(value: any) {}
  modelUpdated(value: any) {
    this.workItem = value;
    this.dirtyData = true;
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.workItemId = params['_id'];

      this.dataSource.getDataSource({ name: 'FieldForce.WorkItems.Details', inputData: JSON.stringify({ _id: this.workItemId }) }).subscribe(results => {
        if (!results.inflight) {
          this.workItem = JSON.parse(results.jsonData)[0];
          if (this.workItem.dateCompleted) {
            this.workItem.dateCompleted = new Date(this.workItem.dateCompleted);
          }
          if (this.workItem.dateConfirmed) {
            this.workItem.dateConfirmed = new Date(this.workItem.dateConfirmed);
          }
          if (this.workItem.datePlanned) {
            this.workItem.datePlanned = new Date(this.workItem.datePlanned);
          }
          if (this.workItem.dateReceived) {
            this.workItem.dateReceived = new Date(this.workItem.dateReceived);
          }
        }
      });
    });
  }
}
