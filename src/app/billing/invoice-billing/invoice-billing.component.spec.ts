import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBillingComponent } from './invoice-billing.component';

describe('InvoiceBillingComponent', () => {
  let component: InvoiceBillingComponent;
  let fixture: ComponentFixture<InvoiceBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
