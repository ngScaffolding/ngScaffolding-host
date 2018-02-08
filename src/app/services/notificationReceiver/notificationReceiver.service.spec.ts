import { TestBed, inject } from '@angular/core/testing';

import { NotificationReceiverService } from './notificationReceiver.service';

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationReceiverService]
    });
  });

  it('should be created', inject([NotificationReceiverService], (service: NotificationReceiverService) => {
    expect(service).toBeTruthy();
  }));
});
