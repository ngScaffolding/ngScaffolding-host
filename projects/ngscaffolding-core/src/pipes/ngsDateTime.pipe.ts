import * as dateFormatimp from 'dateformat';
const dateFormat = dateFormatimp;

import { Pipe, PipeTransform } from '@angular/core';
import { AppSettingsQuery } from '../services/appSettings/appSettings.query';
import { AppSettings } from '@ngscaffolding/models';

@Pipe({ name: 'ngsDateTime' })
export class NgsDateTimePipe implements PipeTransform {
  constructor(private appSettings: AppSettingsQuery) {}
  transform(inputDate: Date): string {
    if (inputDate) {
      const format = this.appSettings.getEntity(AppSettings.momentDateTimeFormat);
      return dateFormat(inputDate, format.value);
    } else {
      return '';
    }
  }
}
