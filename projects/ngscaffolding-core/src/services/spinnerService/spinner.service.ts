import { Injectable } from '@angular/core';

import {
  BroadcastService,
  BroadcastTypes
} from '../broadcast/broadcast.service';

@Injectable()
export class SpinnerService {
  constructor(private broadcastService: BroadcastService) {}

  public showSpinner(message: string = null) {
    this.broadcastService.broadcast(BroadcastTypes.SHOW_SPINNER, message);
  }

  public hideSpinner() {
    this.broadcastService.broadcast(BroadcastTypes.HIDE_SPINNER);
  }
}
