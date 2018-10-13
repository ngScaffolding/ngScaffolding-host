import { Injectable } from '@angular/core';
import { ChartDetailModel } from '@ngscaffolding/models';
import { Chart } from 'angular-highcharts';

@Injectable()
export class ChartDataService {
  public convertToPieChart() {}

  public convertToBarChart(chartDetail: ChartDetailModel, chartInstance: any, data: any[]): any {
    const xAxis: string[] = [];

    const newSeries = new Map<string, string[]>();
    //let firstTime = true;

    data.forEach(row => {
      // if (chartDetail.xAxisName) {
      //   xAxis.push(row[chartDetail.xAxisName]);
      // }

      // // First Time create arrays
      // if (firstTime) {
      //   chartDetail.seriesNames.forEach(seriesName => {
      //     newSeries[seriesName] = [];
      //   });
      //   firstTime = false;
      // }

      // // Add values into our Series
      // chartDetail.seriesNames.forEach(seriesName => {
      //   newSeries[seriesName].push(row[seriesName]);
      // });
    });

    if (xAxis.length > 0) {
      chartInstance.xAxis = {};
      chartInstance.xAxis.categories = xAxis;
    }

    // chartInstance.series = [];
    // chartDetail.seriesNames.forEach(seriesName => {
    //   chartInstance.series.push({ name: seriesName, data: newSeries[seriesName] });
    // });
  }
}
