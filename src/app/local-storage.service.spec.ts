import { TestBed } from '@angular/core/testing';

// import { LocalStorageService } from './local-storage.service';
import { LocalStorage } from './localstorage.service'


describe('LocalStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalStorage = TestBed.get(LocalStorage);
    expect(service).toBeTruthy();
  });
});
