import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlysalesreportComponent } from './monthlysalesreport.component';

describe('MonthlysalesreportComponent', () => {
  let component: MonthlysalesreportComponent;
  let fixture: ComponentFixture<MonthlysalesreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlysalesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlysalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
