import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumberMeetReportComponent } from './plumber-meet-report.component';

describe('PlumberMeetReportComponent', () => {
  let component: PlumberMeetReportComponent;
  let fixture: ComponentFixture<PlumberMeetReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlumberMeetReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumberMeetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
