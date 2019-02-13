import * as moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';
import { AppSettingsQuery } from '../services';
import { AppSettings } from '@ngscaffolding/models';

@Pipe({ name: 'ngsDateTime' })
export class NgsDateTimePipe implements PipeTransform {
  constructor(private appSettings: AppSettingsQuery) {}
  transform(inputDate: Date): string {
    if (inputDate) {
      const format = this.appSettings.getEntity(AppSettings.momentDateTimeFormat);
      return moment(inputDate).format(format.value);
    } else {
      return '';
    }
  }
}
