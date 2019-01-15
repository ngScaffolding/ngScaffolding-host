import { Component, OnInit, ViewChild } from '@angular/core';
import {
  InputBuilderDefinition,
  InputTypes,
  OrientationValues,
  InputDetailDropdown,
  InputDetailToggleButton,
  InputDetailTextArea,
  InputDetailTextBox,
  ChartDetailModel
} from '@ngscaffolding/models';
import { ChartComponent } from 'ngscaffolding-chart';

@Component({
  templateUrl: 'chartSample.component.html',
  styleUrls: ['chartSample.component.scss']
})
export class ChartSampleComponent implements OnInit {
  @ViewChild(ChartComponent) chart1: ChartComponent;

  constructor() {}

  chartDetail2: ChartDetailModel = null;

  chartDetail: ChartDetailModel = {
    title: '24hr Temperature',
    chartOptions: {
      panning: true,
      yAxis: {},
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2010
        }
      },

      series: [
        {
          name: 'Installation',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        },
        {
          name: 'Manufacturing',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        },
        {
          name: 'Sales & Distribution',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        },
        {
          name: 'Project Development',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        },
        {
          name: 'Other',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }
      ],

      responsive: {}
    }
  };

  ngOnInit() {
    setTimeout(() => {
      console.log('Swapping');
      this.chartDetail.chartOptions.series[0].data = [
        143934,
        12503,
        157177,
        19658,
        197031,
        19931,
        37133,
        54175
      ];
      this.chartDetail.chartOptions.series[0].name = 'New Installation';
    }, 5000);
  }
}
