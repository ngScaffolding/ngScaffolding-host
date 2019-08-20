import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppSettingsService, AppSettingsQuery } from 'ngscaffolding-core';

@Component({
  selector: 'ngs-html-container',
  templateUrl: './htmlContainer.component.html',
  styleUrls: ['./htmlContainer.component.scss']
})
export class HtmlContainerComponent { }
