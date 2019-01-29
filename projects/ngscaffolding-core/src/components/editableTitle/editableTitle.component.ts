import { Component, Inject, forwardRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ngs-editable-title',
  templateUrl: 'editableTitle.component.html',
  styleUrls: ['editableTitle.component.scss']
})
export class EditableTitleComponent implements OnChanges {
  @ViewChild('inputTitle') inputTitleElement: ElementRef;
  @Input() title: string;
  @Input() readOnly: boolean;

  @Output() titleChanged = new EventEmitter<string>();

  editTitle: string;
  displayIcon = false;
  isEditing = false;

  ngOnChanges(changes: SimpleChanges) {
    this.editTitle = changes.title.currentValue;
  }

  mouseOver() {
    if (!this.readOnly) {
      this.displayIcon = true;
    }
  }
  mouseLeave() {
    this.displayIcon = false;
  }
  mouseClicked() {
    if (!this.readOnly) {
      this.isEditing = true;
      this.displayIcon = false;
    }
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.inputTitleElement.nativeElement.focus();
      this.inputTitleElement.nativeElement.select();
    }, 0);
  }

  textChanged() {
    this.titleChanged.emit(this.editTitle);
  }
}
