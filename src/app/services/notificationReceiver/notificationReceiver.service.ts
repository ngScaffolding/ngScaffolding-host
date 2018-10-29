import { Injectable } from '@angular/core';
import { BroadcastService, BroadcastTypes } from 'ngscaffolding-core';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class NotificationReceiverService {
  constructor(
    private broadcast: BroadcastService,
    private messageService: MessageService
  ) {
    broadcast.on(BroadcastTypes.SHOW_MESSAGE).subscribe(notification => {
      const message = notification as Message;
      if (message) {
        this.messageService.add(message);
      }
    });
  }
}
