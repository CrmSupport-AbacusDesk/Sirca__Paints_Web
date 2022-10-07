import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationEmailModalComponent } from './quotation-email-modal.component';

describe('QuotationEmailModalComponent', () => {
  let component: QuotationEmailModalComponent;
  let fixture: ComponentFixture<QuotationEmailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationEmailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
