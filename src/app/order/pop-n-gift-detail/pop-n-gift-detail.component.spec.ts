import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopNGiftDetailComponent } from './pop-n-gift-detail.component';

describe('PopNGiftDetailComponent', () => {
  let component: PopNGiftDetailComponent;
  let fixture: ComponentFixture<PopNGiftDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopNGiftDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopNGiftDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
