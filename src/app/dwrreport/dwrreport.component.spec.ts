import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwrreportComponent } from './dwrreport.component';

describe('DwrreportComponent', () => {
  let component: DwrreportComponent;
  let fixture: ComponentFixture<DwrreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwrreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwrreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
