import { TestBed } from '@angular/core/testing'

import { TimeIntervalsService } from './time-intervals.service'

describe('TimeIntervalsService', () => {
  let service: TimeIntervalsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TimeIntervalsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
  describe('Time intervals management', () => {
    it('should return 31 elements if the month days is 31 when getAllMonthColumnsCompared is called', () => {})
    it('should return a sliced 288 elements when the raw data is passed to returnSlicedArrayByDay function', () => {})
  })
})
