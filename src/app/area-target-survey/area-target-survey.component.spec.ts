import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTargetSurveyComponent } from './area-target-survey.component';

describe('AreaTargetSurveyComponent', () => {
  let component: AreaTargetSurveyComponent;
  let fixture: ComponentFixture<AreaTargetSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTargetSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaTargetSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
