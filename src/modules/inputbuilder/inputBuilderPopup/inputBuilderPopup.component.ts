import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { InputBuilderDefinition } from '@ngscaffolding/models';

@Component({
  selector: 'app-input-builder-popup',
  templateUrl: 'inputBuilderPopup.component.html',
  styleUrls: ['inputBuilderPopup.component.scss']
})
export class InputBuilderPopupComponent implements OnInit {
  @Input() inputBuilderDefinition: InputBuilderDefinition;
  @Input() inputModel: any;

  @Output() modelUpdated = new EventEmitter<any>();
  @Output() valueUpdated = new EventEmitter<[string, any]>();

  @Output() okClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();

  isShown: boolean;

  private returnModel: any;

  showPopup() {
    this.isShown = true;
  }

  ngOnInit(): void {

  }

  notifyChanged(event: any) {

  }

  onModelUpdated(model: any){
    this.modelUpdated.emit(model);
    this.returnModel  = model;
  }
  onValueUpdated(){}

  onOkClicked(model: any) {
    this.okClicked.emit(this.returnModel);
    // this.isShown = false;
  }
  onCancelClicked() {
    this.cancelClicked.emit(null);
    this.isShown = false;
  }
}

