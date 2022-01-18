import { Component, OnDestroy, OnInit } from '@angular/core'
import { INTERVAL_RANGE_IN_MINUTES, INTERVALS, MONTHS } from '../../shared/consts'
import { FormControl } from '@angular/forms'
import { combineLatest, Subject } from 'rxjs'
import { map, take, takeUntil } from 'rxjs/operators'
import { TimeIntervalsService } from './services/time-intervals.service'
import { IInterval } from '../../shared/interfaces/IInterval'
import { MockDataGeneratorService } from '../../shared/services/mock-data-generator.service'
import { IColumnsByRange } from '../../shared/interfaces/IColumnsByRange'
import * as moment from 'moment'
import { IIntervalData } from '../../shared/interfaces/IIntervalData'
import {flatMap} from "rxjs/internal/operators"

@Component({
  selector: 'time-intervals',
  templateUrl: './time-intervals.component.html',
  styleUrls: ['./time-intervals.component.scss']
})
export class TimeIntervalsComponent implements OnInit, OnDestroy {
  public intervals = INTERVALS
  public months = MONTHS
  public intervalsValues = INTERVAL_RANGE_IN_MINUTES
  public selectedMonth = moment().month()
  public intervalControl = new FormControl(this.intervalsValues.EVERY_FIVE)
  public monthControl = new FormControl(this.selectedMonth)
  private unsubscribe$ = new Subject()
  public displayedColumns: Array<string> = []
  public rowsQuantityInMock = 1
  // it multiplies the data N times to populate multiple rows and/or months depending on the case
  // not visible at the moment as rows, it just adds the data.

  breakpoint: number
  /*** contains the full value for the headings. start moment, end moment and label
   * Another solution is to add a pipe to remove the 3rd property label
   * ***/
  public headingIntervalsFullValues: IColumnsByRange = {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: []
  }
  public rowsMonthMockData: any = {}

  public dataSource: Array<Array<{}>> = []
  public daysInMonth: number = moment().set({ date: 1, month: this.selectedMonth }).daysInMonth()

  constructor(private timeIntervalService: TimeIntervalsService, private mockDataGenerator: MockDataGeneratorService) {}

  maxGridCols = 4
  minInnerWidth = 900

  ngOnInit(): void {
    this.breakpoint = window.innerWidth <= this.minInnerWidth ? 1 : this.maxGridCols
    this.generateMockData()
    this.renderTableData(this.intervalsValues.EVERY_FIVE)
    this.intervalControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(newInterval => {
      this.renderTableData(newInterval)
    })
    this.monthControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(month => {
      this.selectedMonth = month
      this.daysInMonth = moment().set({ date: 1, month: this.selectedMonth }).daysInMonth()
      this.generateMockData()
      this.renderTableData(this.intervalControl.value)
    })
  }

  public onResize(event: any) {
    this.breakpoint = event.target.innerWidth <= this.minInnerWidth ? 1 : this.maxGridCols
  }

  private renderTableData(interval: INTERVAL_RANGE_IN_MINUTES) {
    this.renderIntervalsHeadings(interval)
    this.renderIntervalRows(interval)
  }

  public renderIntervalRows(interval: INTERVAL_RANGE_IN_MINUTES) {
    const rowsObservables = []
    for (let row = 0; row < this.rowsQuantityInMock; row++) {
      rowsObservables.push(this.sortMonthData(interval))
    }
    combineLatest(rowsObservables)
      .pipe(
        take(1),
        flatMap(v => {
          return combineLatest(v)
        })
      )
      .subscribe((rows: [any]) => {
        let a = [...rows.flat()]
        let c = a.map((b: any) => b.flat())
        this.dataSource = c as Array<Array<{}>>
      })
  }

  public sortMonthData(interval: INTERVAL_RANGE_IN_MINUTES = INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE) {
    let intervalNumber: number
    if (interval === INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE) {
      intervalNumber = 5
    } else if (interval === INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY) {
      intervalNumber = 30
    } else {
      intervalNumber = 60
    }
    let dayRowsData = this.timeIntervalService.returnSlicedArrayWithAllDays(
      intervalNumber,
      this.rowsMonthMockData,
      this.selectedMonth,
      this.rowsQuantityInMock
    )
    return this.timeIntervalService.getAllMonthColumnsCompared(this.selectedMonth, interval, this.headingIntervalsFullValues, dayRowsData)
  }

  private renderIntervalsHeadings(interval: INTERVAL_RANGE_IN_MINUTES) {
    if (this.isIntervalInCache(interval)) {
      this.displayedColumns = this.headingIntervalsFullValues[interval].map(value => value.intervalName)
      return
    }
    this.renderAndCatchColumns(interval)
  }

  private renderAndCatchColumns(interval: INTERVAL_RANGE_IN_MINUTES) {
    this.timeIntervalService
      .calculateIntervals(interval)
      .pipe(take(1))
      .subscribe((values: Array<IInterval>) => {
        this.headingIntervalsFullValues[interval] = values
        this.displayedColumns = values.map(value => value.intervalName)
      })
  }

  // it generates the unorganized data as if we fetched it from and endpoint or get it from a JSON file
  // the data is not sorted at this point
  public generateMockData(regenerateCached = false, rowsNumber: number = this.rowsQuantityInMock) {
    const obsArray = []
    if (!this.rowsMonthMockData[this.selectedMonth] || regenerateCached) {
      console.log('the mock data is being generated')
      for (let row = 0; row < rowsNumber; row++) {
        obsArray.push(this.mockDataGenerator.oneMonthData(this.daysInMonth, this.selectedMonth))
      }
      combineLatest(obsArray)
        .pipe(
          take(1),
          map((rows: any) => {
            rows = rows.flat()
            return rows.sort((a: IIntervalData, b: IIntervalData) => a.time < b.time)
          })
        )
        .subscribe(rows => {
          this.rowsMonthMockData[this.selectedMonth] = rows
          this.renderTableData(this.intervalControl.value)
        })
    }
    return
  }

  private isIntervalInCache(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.headingIntervalsFullValues[interval]?.length > 0
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
