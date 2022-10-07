import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBillingDetailComponent } from './invoice-billing-detail.component';

describe('InvoiceBillingDetailComponent', () => {
  let component: InvoiceBillingDetailComponent;
  let fixture: ComponentFixture<InvoiceBillingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBillingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBillingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
