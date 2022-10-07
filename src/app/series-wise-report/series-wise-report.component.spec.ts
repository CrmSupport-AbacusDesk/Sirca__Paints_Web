import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesWiseReportComponent } from './series-wise-report.component';

describe('SeriesWiseReportComponent', () => {
  let component: SeriesWiseReportComponent;
  let fixture: ComponentFixture<SeriesWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
