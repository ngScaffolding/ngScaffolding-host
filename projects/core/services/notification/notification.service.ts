import { Injectable } from '@angular/core';
import { BroadcastService, BroadcastTypes } from '../broadcast/broadcast.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private broadcast: BroadcastService) {}

  showMessage(message: any) {
    this.broadcast.broadcast(BroadcastTypes.SHOW_MESSAGE, message);
  }


}
