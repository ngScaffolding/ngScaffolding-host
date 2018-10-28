import { TestBed, inject } from '@angular/core/testing';

import { NgscaffoldingCoreService } from './ngscaffolding-core.service';

describe('NgscaffoldingCoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgscaffoldingCoreService]
    });
  });

  it('should be created', inject([NgscaffoldingCoreService], (service: NgscaffoldingCoreService) => {
    expect(service).toBeTruthy();
  }));
});
