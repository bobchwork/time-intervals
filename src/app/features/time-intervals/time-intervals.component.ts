import { Component, OnDestroy, OnInit } from '@angular/core'
import { ELEMENT_DATA, INTERVAL_RANGE_IN_MINUTES, INTERVALS } from '../../shared/consts'
import { FormControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { TimeIntervalsService } from './services/time-intervals.service'
import { IInterval } from '../../shared/interfaces/IInterval'
import { MockDataGeneratorService } from '../../shared/services/mock-data-generator.service'
import { MatTableDataSource } from '@angular/material/table'
import { IColumnsByRange } from '../../shared/interfaces/IColumnsByRange'

@Component({
  selector: 'time-intervals',
  templateUrl: './time-intervals.component.html',
  styleUrls: ['./time-intervals.component.scss']
})
export class TimeIntervalsComponent implements OnInit, OnDestroy {
  public intervals = INTERVALS
  public intervalsValues = INTERVAL_RANGE_IN_MINUTES
  public intervalControl = new FormControl(this.intervalsValues.EVERY_FIVE)
  private unsubscribe$ = new Subject()
  public displayedColumns: Array<string> = []
  public displayedColumnsByRange: IColumnsByRange = {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: []
  }
  public daysInMonth = [1, 2]

  // since the structure of the array we are passing is dynamic we can not declare a type
  // we know it will be an array of objects that will change depending on the interval selection
  public dataSource: Array<{}> = [...ELEMENT_DATA] as Array<{}>
  public intervalsDataSource = new MatTableDataSource<any>([])

  constructor(private timeIntervalService: TimeIntervalsService, private mockDataGenerator: MockDataGeneratorService) {}

  ngOnInit(): void {
    this.renderIntervalsHeadings(this.intervalsValues.EVERY_FIVE)
    this.intervalControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(newInterval => {
      this.renderIntervalsHeadings(newInterval)
      this.intervalsDataSource.data = this.dataSource
    })
  }

  private renderIntervalsHeadings(interval: INTERVAL_RANGE_IN_MINUTES) {
    if (this.isIntervalAndCatched(interval)) {
      this.displayedColumns = this.displayedColumnsByRange[interval]
      console.log('this headings have already been stored, they were catched')
      return
    }
    this.renderAndCatchColumns(interval)
  }

  private renderAndCatchColumns(interval: INTERVAL_RANGE_IN_MINUTES) {
    this.timeIntervalService
      .calculateIntervals(interval)
      .pipe(take(1))
      .subscribe((values: Array<IInterval>) => {
        // this.intervalObjectsArray[interval] = values
        this.displayedColumnsByRange[interval] = values.map(value => value.intervalName)
        console.log(this.displayedColumnsByRange[interval])
        this.displayedColumns = this.displayedColumnsByRange[interval]
        console.log(`the ${interval} minutes intervals were created`)
      })
  }

  public generateMockData() {
    this.mockDataGenerator.oneDayData(this.intervalControl.value)
  }

  private isIntervalAndCatched(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.displayedColumnsByRange[interval].length > 0
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
