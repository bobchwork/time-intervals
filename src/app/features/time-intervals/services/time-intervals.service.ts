import {Injectable} from '@angular/core'
import {INTERVAL_RANGE_IN_MINUTES} from '../../../shared/consts'
import {Observable} from 'rxjs'
import {IInterval} from '../../../shared/interfaces/IInterval'
import * as moment from 'moment'
import {Moment} from 'moment'
import {IIntervalData} from "../../../shared/interfaces/IIntervalData";
import {IColumnsByRange} from "../../../shared/interfaces/IColumnsByRange";
import {combineAll, combineLatest} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TimeIntervalsService {
  private MINS_IN_HOUR = 60

  constructor() {
  }

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
      rows.push(this.returnSlicedArrayByDay(date, intervalNumber, rowsMonthMockData, selectedMonth, rowsQuantityInMock))
    }
    return rows
  }

  public returnSlicedArrayByDay(date: Moment, intervalNumber: number, rowsMonthMockData: any, selectedMonth: number, rowsQuantityInMock: number) {

    let lastInterval = (60 * 24) / 5

    let startSliceIndex = rowsMonthMockData[selectedMonth].findIndex((item: IIntervalData) => (moment.unix(item.time).format('DD') === date.format('DD')))
    let endSliceIndex = startSliceIndex + (lastInterval * rowsQuantityInMock)
    return rowsMonthMockData[selectedMonth].slice(startSliceIndex, endSliceIndex)
  }

  public getAllMonthColumnsCompared(selectedMonth: number, interval: INTERVAL_RANGE_IN_MINUTES, headingIntervalsFullValues: IColumnsByRange, dayRowsData: Array<IIntervalData>) {
    return new Observable( observer => {
      let daysInMonth = moment().set('month', selectedMonth).daysInMonth()
      let obsArray = []
      for(let row = 0 ; row < daysInMonth; row++) {
        obsArray.push(this.getComparedColumns(interval, headingIntervalsFullValues, dayRowsData, true))
      }
      observer.next(obsArray)

    })
  }
  // the conent is already sorted by date, no need to do unnecessary moment comparisons.
  public getComparedColumns(interval: INTERVAL_RANGE_IN_MINUTES, headingIntervalsFullValues: IColumnsByRange, dayRowsData: Array<IIntervalData>, isMonthArray = false): Observable<any> {
    return new Observable(observer => {
     // console.log(dayRowsData)
      let columns: Array<any> = []
      let rowsStrArray: any = []
/*      if(isMonthArray) {
        rowsStrArray = dayRowsData.map((val) => val)
      }*/
      rowsStrArray = dayRowsData.map(val => val.value)
      let slicedRow: any = [...rowsStrArray]
      let multiplier = interval / 5
      let start: number = 0
      let end: number = 0

      headingIntervalsFullValues[INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE].forEach(
        (headingContent, index) => {
          start = index === 0 ? index : start + multiplier
          end = index === 0 ? multiplier : end + multiplier
          slicedRow = slicedRow.slice(start, end).join(' ')
          columns.push({[this.strToEntry(headingContent.intervalName)]: slicedRow})
          slicedRow = [...rowsStrArray]
        }
      )
      columns = [columns]
      observer.next(columns)
    })
  }

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
        /*console.log(pivotDate.format('DD-MM-YYYY HH:mm'))
        console.log(headingContent.start.format('DD-MM-YYYY HH:mm'))
        console.log(pivotDate.isBetween(start, end))*/
        rowsArray = [...rowsArray, {[this.strToEntry(headingContent.intervalName)]: dayRowsData[row].value}]
      }
    }
    //console.log(rowsArray)
    return rowsArray
  }


// transforms 00:00 - 00:05 into 00000005 so the json looks like [00000005] : 'the str'
  public strToEntry(ex: string) {
    let reg = /[\s:-]/g
    return ex.replace(reg, '')
  }

}
