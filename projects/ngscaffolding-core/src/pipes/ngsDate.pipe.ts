import * as dateFormatimp from 'dateformat';
const dateFormat = dateFormatimp;

import { Pipe, PipeTransform } from '@angular/core';
import { AppSettingsQuery } from '../services';
import { AppSettings } from '@ngscaffolding/models';

@Pipe({ name: 'ngsDate' })
export class NgsDatePipe implements PipeTransform {
  constructor(private appSettings: AppSettingsQuery) {}
  transform(inputDate: Date): string {
    if (inputDate) {
      const format = this.appSettings.getEntity(AppSettings.momentDateFormat);
      return dateFormat(inputDate, format.value);
    } else {
      return '';
    }
  }
}
