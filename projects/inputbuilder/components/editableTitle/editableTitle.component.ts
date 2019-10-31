import { Component, Inject, forwardRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ngs-editable-title',
  templateUrl: 'editableTitle.component.html',
  styleUrls: ['editableTitle.component.scss']
})
export class EditableTitleComponent implements OnChanges {
  @ViewChild('inputTitle', {static: false}) inputTitleElement: ElementRef;
  @Input() title: string;
  @Input() configObject: any;
  @Input() readOnly: boolean;

  @Output() titleChanged = new EventEmitter<string>();

  editTitle: string;
  displayIcon = false;
  isEditing = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.title) {
      this.editTitle = changes.title.currentValue;
      this.applyObject(changes.configObject);
    }
    if (changes.configObject) {
      this.applyObject(changes.configObject);
    }
  }

  // update Title with string replacement @@key## style
  private applyObject(config: any) {
    let newTitle = this.title;

    if (config) {
      for (const key in config) {
        if (config.hasOwnProperty(key)) {
          newTitle = newTitle.replace(`@@${key}##`, config[key]);
        }
      }
      this.editTitle = newTitle;
    }
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
