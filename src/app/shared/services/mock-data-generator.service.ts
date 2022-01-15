import { Injectable } from '@angular/core'
import * as moment from 'moment'
import { Moment } from 'moment'
import { IIntervalData } from '../interfaces/IIntervalData'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MockDataGeneratorService {
  private firstDayCurrentMonth = moment().set({ date: 1, hour: 0, minutes: 0, seconds: 0 })
  private currentDayOfMonth = this.firstDayCurrentMonth.clone() // as a pivot
  private selectedMonth = this.firstDayCurrentMonth.month()

  constructor() {}
  public oneMonthData(daysInMonth: number, selectedMonth: number = this.selectedMonth) {

    this.selectedMonth = selectedMonth
    this.resetFirstDayCurrentMonth(selectedMonth)
    return new Observable(observer => {
      let oneMonthDataArray: Array<IIntervalData> = []
      let oneDayDataArray: Array<IIntervalData> = []
      let dInMonth = this.firstDayCurrentMonth.daysInMonth()
      console.log(daysInMonth)
      for (let day = 0; day < dInMonth; day++) {
        oneDayDataArray = this.oneDayData()
        oneMonthDataArray = [...oneMonthDataArray, ...oneDayDataArray]
      }
      observer.next(oneMonthDataArray)
    })
  }

  public resetFirstDayCurrentMonth(selectedMonth: number) {
    this.firstDayCurrentMonth.set({ date: 1, hour: 0, minutes: 0, seconds: 0})
    this.firstDayCurrentMonth.set('month',selectedMonth)
    this.currentDayOfMonth = this.firstDayCurrentMonth.clone()
  }


  public oneDayData() {
    const hoursInADay = 24
    let oneDayDataArray: Array<IIntervalData> = []
    let oneHourDataArray: Array<IIntervalData> = []
    for (let a = 0; a < hoursInADay; a++) {
    //  console.log('day in current month',this.currentDayOfMonth.format('DD-MM-YYYY'))
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
    let newDate = date
    for (let interval = 0; interval < intervalsOfFiveInHour; interval++) {
      randomTime = this.generateTimestampValue(0, 5, newDate)
      newDate.add(5, 'minutes')
      oneHourDataArray = [
        ...oneHourDataArray,
        {
          time: parseInt(randomTime.format('X')),
          value: randomTime.format('DD,MMMM : HH:mm')
        }
      ]
    }
    return oneHourDataArray
  }

  private generateTimestampValue(min: number, max: number, currentTime: Moment) {
    return moment(currentTime).add(this.randomNumber(min, max), 'minutes')
  }

  private randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
