import { Injectable } from '@angular/core'
import * as moment from 'moment'
import { Moment } from 'moment'
import { IIntervalData } from '../interfaces/IIntervalData'
import { Observable } from 'rxjs'
import { ELEMENT_DATA } from '../consts'

@Injectable({
  providedIn: 'root'
})
export class MockDataGeneratorService {
  private firstDayCurrentMonth = moment().set({ date: 1, hour: 0, minutes: 0, seconds: 0 })
  private currentDayOfMonth = this.firstDayCurrentMonth.clone() // as a pivot
  private selectedMonth = this.firstDayCurrentMonth.month()
  public randomStrigsArray: Array<string> = ELEMENT_DATA.map(({ name }) => name)

  constructor() {}

  public oneMonthData(daysInMonth: number, selectedMonth: number = this.selectedMonth) {
    this.selectedMonth = selectedMonth
    this.resetFirstDayCurrentMonth(selectedMonth)
    return new Observable(observer => {
      let oneMonthDataArray: Array<IIntervalData> = []
      let oneDayDataArray: Array<IIntervalData> = []
      let dInMonth = this.firstDayCurrentMonth.daysInMonth()
      for (let day = 0; day < dInMonth; day++) {
        oneDayDataArray = this.oneDayData()
        oneMonthDataArray = [...oneMonthDataArray, ...oneDayDataArray]
      }
      this.resetFirstDayCurrentMonth(selectedMonth)
      observer.next(oneMonthDataArray)
    })
  }

  public resetFirstDayCurrentMonth(selectedMonth: number) {
    this.firstDayCurrentMonth.set({ date: 1, hour: 0, minutes: 0, seconds: 0 })
    this.firstDayCurrentMonth.set('month', selectedMonth)
    this.currentDayOfMonth = this.firstDayCurrentMonth.clone()
  }

  public oneDayData() {
    const hoursInADay = 24
    let oneDayDataArray: Array<IIntervalData> = []
    let oneHourDataArray: Array<IIntervalData> = []
    for (let a = 0; a < hoursInADay; a++) {
      oneHourDataArray = this.oneHourData(this.currentDayOfMonth)
      oneDayDataArray = [...oneDayDataArray, ...oneHourDataArray]
    }
    // running in es2019
    return oneDayDataArray
  }

  private oneHourData(date: Moment): Array<IIntervalData> {
    const intervalsOfFiveInHour = 60 / 5
    let oneHourDataArray: Array<IIntervalData> = []
    let randomTime
    let randomIndexNumber
    let newDate = date
    for (let interval = 0; interval < intervalsOfFiveInHour; interval++) {
      randomTime = MockDataGeneratorService.generateTimestampValue(0, 5, newDate)
      newDate.add(5, 'minutes')
      randomIndexNumber = MockDataGeneratorService.randomNumber(0, this.randomStrigsArray.length - 1)
      oneHourDataArray = [
        ...oneHourDataArray,
        {
          time: Number(randomTime.format('X')),
          value: this.randomStrigsArray[randomIndexNumber] as string // randomTime.format('DD-MM-YYYY HH:mm') //  for testing
        }
      ]
    }
    return oneHourDataArray
  }

  private static generateTimestampValue(min: number, max: number, currentTime: Moment) {
    return moment(currentTime).add(MockDataGeneratorService.randomNumber(min, max), 'minutes')
  }

  private static randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
