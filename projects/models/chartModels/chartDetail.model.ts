import { InputBuilderDefinition } from '../inputBuilderModels/inputBuilderDefinition.model';

export const enum DataShapes {
    // A|B
    // 1|4
    // 2|5
    // 3|6
    // Lables = ['A','B']
    // Column 0 = [1,2,3] Column 1 = [4,5,6]
    ColumToArray = 'ColumToArray',

    // Peter|1|Blue
    // Paul |6|Yellow
    // = [['Peter', 1, 'Blue'], ['Paul', 6, 'Yellow']]
    RowToArray = 'RowToArray',

    // Peter|1|Blue
    // Paul |6|Yellow
    // = [{'Peter', 1, 'Blue'}, {'Paul', 6, 'Yellow'}]
    RowToObject = 'RowToObject'
  }

export interface ChartDetailModel {
    title: string;
    filters?: InputBuilderDefinition;
    chartOptions: any;

    // datasource to populate Series collection
    dataSourceName?: string;
    
    // OR Get the xAxis labels from the data
    labelsInFirstValue?: boolean;

    // How are we expecting our data?
    dataShape?: DataShapes;

    // Represents locations of proerties in x,y
    objectNames?: Array<[string, string]>;

    // Property Names to be transformed in results
    propertyLocations?: Array<[string, string]>;
}
