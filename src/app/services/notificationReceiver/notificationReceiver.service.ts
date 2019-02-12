import { Injectable } from '@angular/core';
import { BroadcastService, BroadcastTypes } from 'ngscaffolding-core';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class NotificationReceiverService {
  constructor(
    private translationService: TranslateService,
    private broadcast: BroadcastService,
    private messageService: MessageService
  ) {
    broadcast.on(BroadcastTypes.SHOW_MESSAGE).subscribe(notification => {
      const message = notification as Message;
      if (message) {
        this.messageService.add({
          severity: message.severity,
          summary: this.translationService.instant(message.summary),
          detail: this.translationService.instant(message.detail)
        });
      }
    });
  }
}
