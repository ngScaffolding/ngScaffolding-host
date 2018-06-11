import { Injectable } from '@angular/core';
import { ChartDetailModel } from '../models/chartDetail.model';
import { Chart } from 'angular-highcharts';

@Injectable()
export class ChartDataService {
  public convertToPieChart() {}

  public convertToBarChart(chartDetail: ChartDetailModel, chartInstance: any, data: any[]): any {

    let xAxis: string[] = [];

    data.forEach(row => {
      if (chartDetail.xAxisName) {
        xAxis.push(row[chartDetail.xAxisName]);
      }
    });

    if(xAxis.length > 0)
    {
      chartInstance.xAxis = {};
      chartInstance.xAxis.categories = xAxis;
    }
  }
}
