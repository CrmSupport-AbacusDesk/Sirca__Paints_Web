import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPopNGiftComponent } from './add-pop-n-gift.component';

describe('AddPopNGiftComponent', () => {
  let component: AddPopNGiftComponent;
  let fixture: ComponentFixture<AddPopNGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPopNGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPopNGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
