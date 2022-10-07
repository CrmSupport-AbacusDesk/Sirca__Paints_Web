import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopNGiftListComponent } from './pop-n-gift-list.component';

describe('PopNGiftListComponent', () => {
  let component: PopNGiftListComponent;
  let fixture: ComponentFixture<PopNGiftListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopNGiftListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopNGiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
