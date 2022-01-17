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
  describe('intervals generator', () => {
    it('should create 288 items for every 5 min intervals in a day', ()=> {

    })
    it('should create 48 items for every 30 min intervals in a day', ()=> {

    })
    it('should create 24 items for every 60 min intervals in a day', ()=> {

    })

    it('should create 8928 when a 31 month date is selected', ()=> {

    })
    it('should create items every 5 mins', ()=> {

    })
  })
})
