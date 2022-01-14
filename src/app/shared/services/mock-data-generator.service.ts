import { Injectable } from '@angular/core'
import { TimeIntervalsService } from '../../features/time-intervals/services/time-intervals.service'
import { take } from 'rxjs/operators'
import { INTERVAL_RANGE_IN_MINUTES } from '../consts'

@Injectable({
  providedIn: 'root'
})
export class MockDataGeneratorService {
  constructor(private timeIntervalsService: TimeIntervalsService) {}

  public oneDayData(intervalValue: INTERVAL_RANGE_IN_MINUTES) {
    this.timeIntervalsService
      .calculateIntervals(intervalValue)
      .pipe(take(1))
      .subscribe(value => {
        console.log(value)
      })
  }
  public oneMonthData() {}
  private oneHourData() {}
}
