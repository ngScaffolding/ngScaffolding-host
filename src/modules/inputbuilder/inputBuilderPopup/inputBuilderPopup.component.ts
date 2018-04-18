import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { InputBuilderDefinition } from '../inputbuilderModule';

@Component({
  selector: 'input-builder-popup',
  templateUrl: 'inputBuilderPopup.component.html',
  styleUrls: ['inputBuilderPopup.component.scss']
})
export class InputBuilderPopupComponent implements OnInit {
  @Input() inputBuilderDefinition: InputBuilderDefinition;
  @Input() inputModel: any;
  @Input() showPopup: boolean;

  @Output() okClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();



  ngOnInit(): void {

  }

  notifyChanged(event: any) {

  }

  onOkClicked() {
    this.okClicked.emit(this.inputModel);
    this.showPopup = false;
  }
  onCancelClicked() {
    this.cancelClicked.emit(null);
    this.showPopup = false;
  }
}
