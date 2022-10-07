import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseToWarehouseSummaryComponent } from './warehouse-to-warehouse-summary.component';

describe('WarehouseToWarehouseSummaryComponent', () => {
  let component: WarehouseToWarehouseSummaryComponent;
  let fixture: ComponentFixture<WarehouseToWarehouseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseToWarehouseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseToWarehouseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
