import { Injectable } from '@angular/core';
import { ChartDetailModel, DataShapes } from 'ngscaffolding-models';

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
            case DataShapes.GroupByOutput: {
                let arrayFieldNames = [];

                // Work out Labels First
                data.forEach(dataItem => {
                    if(arrayFieldNames.length === 0) {
                      // Get field Names
                      for (const key in dataItem) {
                        if (dataItem.hasOwnProperty(key)) {
                          arrayFieldNames.push(key);
                        }
                      }
                    }

                    if (returnValues.xAxisLabels.indexOf(dataItem[arrayFieldNames[0]]) === -1) {
                        returnValues.xAxisLabels.push(dataItem[arrayFieldNames[0]]);
                    }
                });

                data.forEach(dataItem => {
                    if (!returnValues.data.find(series => series.name === dataItem[arrayFieldNames[1]])) {
                        returnValues.data.push({
                            name: dataItem[arrayFieldNames[1]],
                            data: new Array<number>(returnValues.xAxisLabels.length).fill(0)
                        });
                    }
                });

                data.forEach(dataItem => {
                  const xAxisPointer = returnValues.xAxisLabels.indexOf(dataItem[arrayFieldNames[0]]);
                  const seriesHolder = returnValues.data.find(series => series.name === dataItem[arrayFieldNames[1]]);
                  seriesHolder.data[xAxisPointer] = dataItem[arrayFieldNames[2]];
                });

                break;
            }

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
            default: {
                // No Need to make changes to data
                if (chartDetail.labelsInFirstValue) {
                    data.forEach(dataItem => {
                        // Gets first property of the object
                        returnValues.xAxisLabels.push(dataItem[Object.keys(dataItem)[0]]);
                    });
                }
                returnValues.data = data;

                // returnValues.data = [];
                // data.forEach(dataItem => {
                //   const arr = [];
                //   arr.push(dataItem['ts']);
                //   arr.push(dataItem['wetAirIn']);
                //   returnValues.data.push(arr);
                // });

                break;
            }
        }
        return returnValues;
    }

    private extractComplexProperties(row: any, complexProperties: Array<[string, string]>): any {
        if (complexProperties) {
            complexProperties.forEach(property => {
                const destProp = property[0];

                // Get the Path
                const sourcePaths = property[1].split('.');
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
