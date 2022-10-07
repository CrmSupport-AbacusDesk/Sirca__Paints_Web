import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileModelComponent } from './upload-file-model.component';

describe('UploadFileModelComponent', () => {
  let component: UploadFileModelComponent;
  let fixture: ComponentFixture<UploadFileModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
