export interface DataSetResults {
  rowCount: number;
  jsonData: string;
  results: ActionResult[];
}

export interface ActionResult {
  success: boolean;
  message: string;
}
