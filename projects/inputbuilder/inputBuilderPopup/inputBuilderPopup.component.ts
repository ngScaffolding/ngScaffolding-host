import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { InputBuilderDefinition } from 'ngscaffolding-models';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'ngs-input-builder-popup',
  templateUrl: 'inputBuilderPopup.component.html',
  styleUrls: ['inputBuilderPopup.component.scss']
})
export class InputBuilderPopupComponent implements OnInit, OnDestroy {
  @Input() inputBuilderDefinition: InputBuilderDefinition;
  @Input() inputModel: any;
  @Input() setWidth: number;
  @Input() setTop: number;
  @Input() setLeft: number;

  @Output() modelUpdated = new EventEmitter<any>();
  @Output() valueUpdated = new EventEmitter<[string, any]>();

  @Output() okClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();

  isShown: boolean;

  private returnModel: any;
  private mouseSubscription: Subscription;
  private mouseX: number;
  private mouseY: number;
  private screenWidth: number;

  showPopup() {
      this.isShown = true;
  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;

      this.mouseSubscription = fromEvent(document.body, 'mousemove').subscribe(e => {
          if (this.setWidth) {
              this.mouseY = e['pageY'];
              this.mouseX = e['pageX'];

              if (this.mouseX + this.setWidth > this.screenWidth) {
                  this.setLeft = this.mouseX - this.setWidth;
              } else {
                  this.setLeft = this.mouseX;
              }
              this.setTop = this.mouseY;
          }
      });
  }

  ngOnDestroy(): void {
      if (this.mouseSubscription) {
          this.mouseSubscription.unsubscribe();
      }
  }

  notifyChanged(event: any) {}

  onModelUpdated(model: any) {
      this.modelUpdated.emit(model);
      this.returnModel = model;
  }
  onValueUpdated() {}

  onOkClicked(model: any) {
      this.okClicked.emit(model);
      // this.isShown = false;
  }
  onCancelClicked() {
      this.cancelClicked.emit(null);
      this.isShown = false;
  }
}
