import {TestBed} from '@angular/core/testing'

import {TimeIntervalsService} from './time-intervals.service'
import {INTERVAL_RANGE_IN_MINUTES} from "../../../shared/consts";
import {TEST_DATA} from "../../../shared/consts/test-data";
import {IColumnsByRange} from "../../../shared/interfaces/IColumnsByRange";
import {IInterval} from "../../../shared/interfaces/IInterval";

describe('TimeIntervalsService', () => {
  let service: TimeIntervalsService
  const headingsFullData: {} = TEST_DATA.HEADING_FULL_VALUES_FIVE_MINS
  const daysRowsData: any = TEST_DATA.SLICED_DAY_ROW_DATA
  let headingIntervalsFullValues: IColumnsByRange =
    {
      [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: TEST_DATA.HEADING_FULL_VALUES_FIVE_MINS as IInterval[],
      [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: TEST_DATA.HEADING_FULL_VALUES_THIRTY_MINS,
      [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: TEST_DATA.HEADING_FULL_VALUES_SIXTY_MINS as IInterval[],

    }
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TimeIntervalsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
  fdescribe('Time intervals management', () => {

    it('should return 288 in the headings if the interval is 5', async () => {
      const observable = service.calculateIntervals(INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE)
      observable.subscribe(value => {
        expect(value.length).toEqual(288)
      })
    })
    it('should compare the columns and return  an array with 31 days and 288 records in each day for interval = 5 ', () => {

      const observable = service.getComparedColumns(
        INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE,
        headingIntervalsFullValues,
        daysRowsData,
        31
      )
      observable.subscribe(data => {
        expect(data.length).toEqual(31)
        expect(data[0].length).toEqual(288)
      })
    })
    it('should compare the columns and return  an array with 31 days and 48 records in each day for interval = 30 ', () => {

      const observable = service.getComparedColumns(
        INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY,
        headingIntervalsFullValues,
        daysRowsData,
        31
      )
      observable.subscribe(data => {
        expect(data.length).toEqual(31)
        expect(data[0].length).toEqual(48)
      })
    })
    it('should compare the columns and return  an array with 31 days and 24 records in each day for interval = 60 ', () => {

      const observable = service.getComparedColumns(
        INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY,
        headingIntervalsFullValues,
        daysRowsData,
        31
      )
      observable.subscribe(data => {
        expect(data.length).toEqual(31)
        expect(data[0].length).toEqual(24)
      })
    })
    it('should convert the time into numbers for the keys in the objects', () => {
      const value = service.strToEntry('00:00 - 00:05')
      expect(value).toEqual('00000005')
    })
    it('should return 48 in the headings if the interval is 30', async () => {
      const observable = service.calculateIntervals(INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY)
      observable.subscribe(value => {
        expect(value.length).toEqual(48)
      })
    })
    it('should return 24 in the headings if the interval is 60', async () => {
      const observable = service.calculateIntervals(INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY)
      observable.subscribe(value => {
        expect(value.length).toEqual(24)
      })
    })
  })
})
