import { TestBed, inject } from '@angular/core/testing';
import { ChartDataService, ShapedChartData } from './chartData.service';
import { ChartDetailModel, DataShapes } from '@ngscaffolding/models';

describe('ChartDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartDataService]
    });
  });

  it('should be created', inject([ChartDataService], (service: ChartDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should return correct ColumnToArray with Labels', inject([ChartDataService], (service: ChartDataService) => {
    const chartDetail: ChartDetailModel = {
      title: 'Hello',
      chartOptions: {},
      dataShape: DataShapes.ColumToArray,
      labelsInFirstValue: true
    };
    const data = [
      { first: 'Label1', second: 'Label2' },
      { val1: 'Value1.1', val2: 'Value2.1' },
      { val1: 'Value1.2', val2: 'Value2.2' }
    ];
    const expected: ShapedChartData = {
      xAxisLabels: ['Label1', 'Label2'],
      data: [
        ['Value1.1', 'Value1.2'],
        ['Value2.1', 'Value2.2']
      ]
    };
    expect(service.shapeDataForSeries(chartDetail, data)).toEqual(expected);
  }));

  it('should return correct ColumnToArray without Labels', inject([ChartDataService], (service: ChartDataService) => {
    const chartDetail: ChartDetailModel = {
      title: 'Hello',
      chartOptions: {},
      dataShape: DataShapes.ColumToArray,
      labelsInFirstValue: false
    };
    const data = [
      { val1: 'Value1.1', val2: 'Value2.1' },
      { val1: 'Value1.2', val2: 'Value2.2' }
    ];
    const expected: ShapedChartData = {
      xAxisLabels: [],
      data: [
        ['Value1.1', 'Value1.2'],
        ['Value2.1', 'Value2.2']
      ]
    };
    expect(service.shapeDataForSeries(chartDetail, data)).toEqual(expected);
  }));
});
