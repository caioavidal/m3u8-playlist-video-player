import { TestBed } from '@angular/core/testing';

import { M3uParserService } from './m3u-parser.service';

describe('M3uParserService', () => {
  let service: M3uParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(M3uParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
