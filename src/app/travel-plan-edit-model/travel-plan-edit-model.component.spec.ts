import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPlanEditModelComponent } from './travel-plan-edit-model.component';

describe('TravelPlanEditModelComponent', () => {
  let component: TravelPlanEditModelComponent;
  let fixture: ComponentFixture<TravelPlanEditModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelPlanEditModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelPlanEditModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
