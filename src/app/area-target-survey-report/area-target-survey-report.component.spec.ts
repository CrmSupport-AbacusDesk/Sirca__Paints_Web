import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTargetSurveyReportComponent } from './area-target-survey-report.component';

describe('AreaTargetSurveyReportComponent', () => {
  let component: AreaTargetSurveyReportComponent;
  let fixture: ComponentFixture<AreaTargetSurveyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaTargetSurveyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaTargetSurveyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
