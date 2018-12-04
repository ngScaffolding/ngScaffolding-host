import { DataSetResults, DataShapes } from '@ngscaffolding/models';

export class DataShapingHelper {
  public ShapeData(dataSetResults: DataSetResults, dataShape: DataShapes): any[] {

    const passedResults = JSON.parse(dataSetResults.jsonData);

    switch (dataShape) {
      case DataShapes.OneColumPerSeries: {
        var results = [];

        passedResults.array.forEach(element => {

        });
        break;
      }
      case DataShapes.RowToArray: {
        break;
      }
      case DataShapes.RowToObject: {
      }
    }
  }
}
