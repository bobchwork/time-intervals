import { Injectable } from '@angular/core'
import { INTERVAL_RANGE_IN_MINUTES } from '../../../shared/consts'
import { Observable } from 'rxjs'
import { IInterval } from '../../../shared/interfaces/IInterval'
import * as moment from 'moment'
import { Moment } from 'moment'
import {IIntervalData} from "../../../shared/interfaces/IIntervalData";
import {IColumnsByRange} from "../../../shared/interfaces/IColumnsByRange";

@Injectable({
  providedIn: 'root'
})
export class TimeIntervalsService {
  private MINS_IN_HOUR = 60

  constructor() {}

  public calculateIntervals(intervalValue: INTERVAL_RANGE_IN_MINUTES): Observable<Array<IInterval>> {
    return this.createDayIntervals(intervalValue)
  }

  private createDayIntervals(intervalsRange: INTERVAL_RANGE_IN_MINUTES): Observable<any> {
    return new Observable(observer => {
      const hoursInDay = 24
      let daysIntervalsArray: Array<{}> = []
      let hourIntervalsArray = this.createHourIntervals(intervalsRange)
      let start
      let end
      for (let hour = 0; hour < hoursInDay; hour++) {
        daysIntervalsArray = [
          ...daysIntervalsArray,
          ...hourIntervalsArray.map(value => {
            start = moment(value.start, 'HH:mm').add(hour, 'hours')
            end = moment(value.end, 'HH:mm').add(hour, 'hours')
            return {
              start,
              end,
              intervalName: `${start.format('HH:mm')} - ${end.format('HH:mm')}`
            }
          })
        ]
      }
      observer.next(daysIntervalsArray)
    })
  }

  private createHourIntervals(intervalsRange: INTERVAL_RANGE_IN_MINUTES) {
    const intervalsInPeriod = this.MINS_IN_HOUR / intervalsRange
    const intervalsArray: Array<any> = []
    let endInterval: string | Moment
    for (let interval = 0; interval < intervalsInPeriod; interval++) {
      endInterval = intervalsArray[interval - 1] ? intervalsArray[interval - 1].end : '00:00'
      intervalsArray.push({
        start: TimeIntervalsService.getHoursToStr(interval, endInterval, 'start'),
        end: TimeIntervalsService.getHoursToStr(interval, endInterval, 'end', intervalsRange)
      })
    }
    return intervalsArray
  }

  private static getHoursToStr(index: number, endValue: string | Moment, type: string, intervalsRange?: number) {
    if (type === 'start') {
      return index === 0 ? moment('00:00', 'HH:mm').format('HH:mm') : moment(endValue, 'HH:mm').format('HH:mm')
    } else {
      return index === 0
        ? moment('00:00', 'HH:mm').add(intervalsRange, 'minutes').format('HH:mm')
        : moment(endValue, 'HH:mm').add(intervalsRange, 'minutes').format('HH:mm')
    }
  }

  public returnSlicedArrayByDay(date: Moment, intervalNumber: number, rowsMonthMockData: any, selectedMonth: number, rowsQuantityInMock: number) {
    let startSliceIndex = rowsMonthMockData[selectedMonth].findIndex((item: IIntervalData) => (moment.unix(item.time).format('DD') === date.format('DD')))
    let endSliceIndex = startSliceIndex + (((60 * 24) / intervalNumber) * rowsQuantityInMock)

    return rowsMonthMockData[selectedMonth].slice(startSliceIndex, endSliceIndex)
  }
  public getComparedColumns(interval: INTERVAL_RANGE_IN_MINUTES, headingIntervalsFullValues: IColumnsByRange,dayRowsData: any) {
    let columns: Array<{}> = []
    let isInInterval = false
    headingIntervalsFullValues[interval].forEach(
      ({start, end, intervalName}) => {
        let startTimestamp = Number(start.format('X'))
        let endTimestamp = Number(end.format('X'))
        dayRowsData.map((item: IIntervalData) => {
          isInInterval = moment.unix(item.time).isBetween(moment.unix(startTimestamp), moment.unix(endTimestamp))
          if (isInInterval) {
            columns.push({[intervalName]: item.value})
          }
        })
      })
    return columns
  }
}
