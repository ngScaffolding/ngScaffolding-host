import { Injectable } from '@angular/core';
import { ChartDetailModel, DataShapes } from '@ngscaffolding/models';

export class ShapedChartData {
  xAxisLabels: string[];
  data: any[];
}

@Injectable()
export class ChartDataService {
  public shapeDataForSeries(chartDetail: ChartDetailModel, data: any[]): ShapedChartData {
    const returnValues: ShapedChartData = { xAxisLabels: [], data: [] };

    if (!Array.isArray(data)) {
      data = [data];
    }
    switch (chartDetail.dataShape) {
      case DataShapes.ColumToArray: {
        let rowNumber = 0;
        data.forEach(dataItem => {
          // first time get the count of cols and create the return arrays
          if (returnValues.data.length === 0) {
            const keys = Object.keys(dataItem);
            const columnCount = keys.length;
            // if (chartDetail.labelsInFirstValue) {
            //   columnCount--;
            // }
            for (let columnLoop = 0; columnLoop < columnCount; columnLoop++) {
              returnValues.data.push([]);
            }
          }

          let loopCount = 0;
          const shapedObject = [];

          for (const key in dataItem) {
            if (dataItem.hasOwnProperty(key)) {
              const dataValue = dataItem[key];
              if (rowNumber === 0 && chartDetail.labelsInFirstValue) {
                returnValues.xAxisLabels.push(dataValue);
              } else {
                returnValues.data[loopCount].push(dataValue);
              }

              loopCount++;
            }
          }

          rowNumber++;
        });

        break;
      }

      case DataShapes.RowToArray: {
        data.forEach(dataItem => {
          let loopCount = 0;
          const shapedObject = [];

          for (const key in dataItem) {
            if (dataItem.hasOwnProperty(key)) {
              const dataValue = dataItem[key];
              if (loopCount === 0 && chartDetail.labelsInFirstValue) {
                returnValues.xAxisLabels.push(dataValue);
              } else {
                shapedObject.push(dataValue);
              }

              loopCount++;
            }
          }
          returnValues.data.push(shapedObject);
        });

        break;
      }

      case DataShapes.RowToObject: {
        data.forEach(dataItem => {
          let loopCount = 0;
          const shapedObject = {};

          for (const key in dataItem) {
            if (dataItem.hasOwnProperty(key)) {
              const dataValue = dataItem[key];
              if (loopCount === 0 && chartDetail.labelsInFirstValue) {
                returnValues.xAxisLabels.push(dataValue);
              } else {
                shapedObject[key] = dataValue;
              }

              loopCount++;
            }
          }
          returnValues.data.push(this.extractComplexProperties(shapedObject, chartDetail.propertyLocations));
        });

        break;
      }
    }
    return returnValues;
  }

  private extractComplexProperties(row: any, complexProperties: Array<[string, string]>): any {
    if (complexProperties) {
      complexProperties.forEach(property => {
        let destProp = property[0];

        // Get the Path
        let sourcePaths = property[1].split('.');
        let pointer = row;

        sourcePaths.forEach(path => {
          if (pointer.hasOwnProperty(path)) {
            pointer = pointer[path];
          }
        });

        // Have we moved?
        if (pointer !== row) {
          row[destProp] = pointer;
        }
      });
    }
    return row;
  }
}
