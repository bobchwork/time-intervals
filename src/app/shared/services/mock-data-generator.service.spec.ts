import { TestBed } from '@angular/core/testing'

import { MockDataGeneratorService } from './mock-data-generator.service'

describe('MockDataGeneratorService', () => {
  let service: MockDataGeneratorService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MockDataGeneratorService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})