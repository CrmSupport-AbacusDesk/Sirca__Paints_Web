import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseToWarehouseSummaryDetailComponent } from './warehouse-to-warehouse-summary-detail.component';

describe('WarehouseToWarehouseSummaryDetailComponent', () => {
  let component: WarehouseToWarehouseSummaryDetailComponent;
  let fixture: ComponentFixture<WarehouseToWarehouseSummaryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseToWarehouseSummaryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseToWarehouseSummaryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
