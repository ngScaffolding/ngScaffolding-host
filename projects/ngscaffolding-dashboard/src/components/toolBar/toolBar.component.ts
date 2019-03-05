import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettingsService, AppSettingsQuery } from 'ngscaffolding-core';

@Component({
  selector: 'ngs-dashboard-toolbar',
  templateUrl: './toolBar.component.html',
  styleUrls: ['./toolBar.component.scss'],
  animations: [
    trigger('toolBarExpandedState', [
      state(
        'false',
        style({
          width: '0px',
          opacity: '0',
          overflow: 'hidden'
        })
      ),
      state(
        'true',
        style({
          width: '*',
          opacity: '1'
        })
      ),
      transition('false => true', animate('200ms ease-in')),
      transition('true => false', animate('200ms ease-out'))
    ])
  ]
})
export class DashboardToolBarComponent implements OnInit {
  @Input() showSave: boolean;
  @Input() showSaveAs: boolean;
  @Input() showAdd: boolean;
  @Input() showDelete: boolean;
  @Input() showShare: boolean;
  @Input() showInput: boolean;


  @Output() toolbarClicked = new EventEmitter<string>();

  public expanded = false;

  constructor(public appSettings: AppSettingsService, public appSettingsQuery: AppSettingsQuery) {}

  public toggleMenu() {
    this.expanded = !this.expanded;
  }

  public buttonClicked(name: string) {
    this.toolbarClicked.emit(name);

    this.expanded = false;
  }

  ngOnInit() {}
}
