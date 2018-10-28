import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgscaffoldingCoreComponent } from './ngscaffolding-core.component';

describe('NgscaffoldingCoreComponent', () => {
  let component: NgscaffoldingCoreComponent;
  let fixture: ComponentFixture<NgscaffoldingCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgscaffoldingCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgscaffoldingCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
