import { Injectable } from '@angular/core'
import { INTERVAL_RANGE_IN_MINUTES } from '../../../shared/consts'
import { Observable } from 'rxjs'
import { IInterval } from '../../../shared/interfaces/IInterval'
import * as moment from 'moment'
import { Moment } from 'moment'
import { IIntervalData } from '../../../shared/interfaces/IIntervalData'
import { IColumnsByRange } from '../../../shared/interfaces/IColumnsByRange'

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

  public returnSlicedArrayWithAllDays(intervalNumber: number, rowsMonthMockData: any, selectedMonth: number, rowsQuantityInMock: number) {
    let daysInMonth = moment().set('month', selectedMonth).daysInMonth()
    let rows = []
    let date: Moment
    for (let row = 0; row < daysInMonth; row++) {
      date = moment().set('date', row + 1)
      rows.push(this.returnSlicedArrayByDay(date, intervalNumber, rowsMonthMockData[selectedMonth], rowsQuantityInMock))
    }
    return rows
  }

  public returnSlicedArrayByDay(date: Moment, intervalNumber: number, rowsMonthMockData: any, rowsQuantityInMock: number) {
    let lastInterval = (this.MINS_IN_HOUR * 24) / 5

    let startSliceIndex = rowsMonthMockData.findIndex((item: IIntervalData) => moment.unix(item.time).format('DD') === date.format('DD'))
    let endSliceIndex = startSliceIndex + lastInterval * rowsQuantityInMock
    return rowsMonthMockData.slice(startSliceIndex, endSliceIndex)
  }

  public getAllMonthColumnsCompared(
    selectedMonth: number,
    interval: INTERVAL_RANGE_IN_MINUTES,
    headingIntervalsFullValues: IColumnsByRange,
    dayRowsData: Array<IIntervalData>
  ) {
    return new Observable(observer => {
      let daysInMonth = moment().set('month', selectedMonth).daysInMonth()
      let obsArray = this.getComparedColumns(interval, headingIntervalsFullValues, dayRowsData, daysInMonth)
      observer.next(obsArray)
    })
  }

  // the content is already sorted by date, no need to do unnecessary moment comparisons.
  public getComparedColumns(
    interval: INTERVAL_RANGE_IN_MINUTES,
    headingIntervalsFullValues: IColumnsByRange,
    dayRowsData: any,
    daysInMonth: number
  ): Observable<any> {
    return new Observable(observer => {
      let columns: Array<any> = []
      let start = 0
      let end = interval / 5
      let pivotArray: any = []
      for (let day = 0; day < daysInMonth; day++) {
        pivotArray = [...dayRowsData[day].map((val: IIntervalData) => val.value)]

        let tar: any = []
        headingIntervalsFullValues[interval].forEach(() => {
          // here we can decide what to do with the values we can do some calculation or just display them
          // in this task the values are just displayed with - as a separator
          tar = [...tar, [pivotArray.splice(start, end).join(' - ')]]
          columns[day] = tar
        })
      }
      observer.next(columns)
    })
  }

  // in case more accuracy is needed, this compares the dates.
  // Assuming from the beginning that there will be events generated every 5 mins, they are already
  // sorted increasingly, there's no need to make moment calls for such a big amount of items.
  private compareDates(dayRowsData: Array<IIntervalData>, headingContent: IInterval) {
    let isInInterval = false
    let rowsArray: Array<{}> = []
    let pivotDate = moment.unix(dayRowsData[0].time)
    let start = headingContent.start.set('date', 1)
    let end = headingContent.end.set('date', 1)
    pivotDate.set('date', 1)
    for (let row = 0; row < dayRowsData.length; row++) {
      isInInterval = moment.unix(dayRowsData[row].time).isBetween(start, end)
      if (isInInterval) {
        rowsArray = [...rowsArray, { [this.strToEntry(headingContent.intervalName)]: dayRowsData[row].value }]
      }
    }
    return rowsArray
  }

  // transforms 00:00 - 00:05 into 00000005 so the json looks like [00000005] : 'the str'
  public strToEntry(ex: string) {
    let reg = /[\s:-]/g
    return ex.replace(reg, '')
  }
}
