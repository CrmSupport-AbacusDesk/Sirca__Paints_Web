import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsellingitemComponent } from './topsellingitem.component';

describe('TopsellingitemComponent', () => {
  let component: TopsellingitemComponent;
  let fixture: ComponentFixture<TopsellingitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopsellingitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopsellingitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
