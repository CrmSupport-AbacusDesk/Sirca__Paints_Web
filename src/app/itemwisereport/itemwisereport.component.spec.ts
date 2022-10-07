import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemwisereportComponent } from './itemwisereport.component';

describe('ItemwisereportComponent', () => {
  let component: ItemwisereportComponent;
  let fixture: ComponentFixture<ItemwisereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemwisereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemwisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
