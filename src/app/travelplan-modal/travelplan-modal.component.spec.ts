import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelplanModalComponent } from './travelplan-modal.component';

describe('TravelplanModalComponent', () => {
  let component: TravelplanModalComponent;
  let fixture: ComponentFixture<TravelplanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelplanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelplanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
