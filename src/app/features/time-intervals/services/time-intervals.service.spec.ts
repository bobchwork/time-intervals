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
  // it should return x amount of intervals when 5 mins is selected
  // it should return x amount of intervals when 30 mins is selected
  // it should return x amount of intervals when 1 hour is selected
})
