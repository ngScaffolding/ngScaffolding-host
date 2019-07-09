import { Component, ElementRef, OnInit } from '@angular/core';
import { SpinnerService, ComponentLoaderService } from 'ngscaffolding-core';

@Component({
  templateUrl: 'changePassword.component.html',
  styleUrls: ['changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  inputModel: any = {};

  constructor(private spinner: SpinnerService, private componentLoader: ComponentLoaderService, private elementRef: ElementRef) {}

  ngOnInit(): void {}

  changePassword() {}


}
