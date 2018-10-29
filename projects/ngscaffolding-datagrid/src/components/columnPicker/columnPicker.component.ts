import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnModel } from '@ngscaffolding/models';

@Component({
  selector: 'app-column-picker',
  templateUrl: './columnPicker.component.html',
  styleUrls: ['./columnPicker.component.scss']
})
export class ColumnPickerComponent implements OnInit {

  @Input() columns: ColumnModel[];
  @Output() columnsChanged = new EventEmitter<ColumnModel[]>();

  ngOnInit(): void {}

  constructor() {}

  public columnChanged() {
    this.columnsChanged.emit(this.columns);
  }
}
