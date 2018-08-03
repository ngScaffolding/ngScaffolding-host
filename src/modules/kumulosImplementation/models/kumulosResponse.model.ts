export interface KumulosResponse {
  responseCode: number;
  responseMessage: string;
  payload: any;
  requestedMethod: string;
  requestedFormat: string;
  timestamp: number;
  requestReceivedTime: number;
  maxAllowedRequestTime: number;
  requestProcessingTime: number;
}
