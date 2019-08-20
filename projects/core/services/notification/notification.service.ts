import { Injectable } from '@angular/core';
import { BroadcastService, BroadcastTypes } from '../broadcast/broadcast.service';

import { Message } from 'primeng/primeng';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private broadcast: BroadcastService) {}

  showMessage(message: Message) {
    this.broadcast.broadcast(BroadcastTypes.SHOW_MESSAGE, message);
  }


}
