import { TestBed, inject } from '@angular/core/testing';
import { BroadcastService, BroadcastTypes } from 'ngscaffolding-core';
import { MessageService } from 'primeng/components/common/messageservice';
import { NotificationReceiverService } from './notificationReceiver.service';

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationReceiverService, MessageService, BroadcastService]
    });
  });

  it('should be created', inject([NotificationReceiverService], (service: NotificationReceiverService) => {
    expect(service).toBeTruthy();
  }));
});
