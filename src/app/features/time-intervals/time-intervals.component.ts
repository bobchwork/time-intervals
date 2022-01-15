import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core'
import {ELEMENT_DATA, INTERVAL_RANGE_IN_MINUTES, INTERVALS, MONTHS} from '../../shared/consts'
import {FormControl} from '@angular/forms'
import {combineLatest, forkJoin, Observable, Subject} from 'rxjs'
import {take, takeUntil, tap} from 'rxjs/operators'
import {TimeIntervalsService} from './services/time-intervals.service'
import {IInterval} from '../../shared/interfaces/IInterval'
import {MockDataGeneratorService} from '../../shared/services/mock-data-generator.service'
import {MatTableDataSource} from '@angular/material/table'
import {IColumnsByRange} from '../../shared/interfaces/IColumnsByRange'
import * as moment from 'moment'
import {IIntervalData} from "../../shared/interfaces/IIntervalData";

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
  public displayedColumnsByRange: IColumnsByRange = {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: []
  }
  public rowsMonthMockData: any = {}

  public dataSource: Array<{}> = [...ELEMENT_DATA, ...ELEMENT_DATA, ...ELEMENT_DATA, ...ELEMENT_DATA, ...ELEMENT_DATA] as Array<{}>
  public intervalsDataSource = new MatTableDataSource<any>([])
  private daysInMonth: number = moment().set({date: 1, month: this.selectedMonth}).daysInMonth()

  constructor(private timeIntervalService: TimeIntervalsService, private mockDataGenerator: MockDataGeneratorService) {
  }

  ngOnInit(): void {
    this.generateMockData()
    this.renderTableData(this.intervalsValues.EVERY_FIVE, this.daysInMonth)
    this.intervalControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(newInterval => {
      this.renderTableData(newInterval, this.daysInMonth)
      this.intervalsDataSource.data = this.dataSource
    })
    this.monthControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(month => {
      this.selectedMonth = month
      this.daysInMonth = moment().set({date: 1, month: this.selectedMonth}).daysInMonth()
      this.generateMockData()
    })
  }

  private renderTableData(interval: INTERVAL_RANGE_IN_MINUTES, daysInMonth: number = 30) {
    this.renderIntervalsHeadings(interval)
    // this.renderIntervalsRows()
  }

  // private sortInXIntervals(interval: INTERVAL_RANGE_IN_MINUTES) {}

  private renderIntervalsHeadings(interval: INTERVAL_RANGE_IN_MINUTES) {
    if (this.isIntervalAndCatched(interval)) {
      this.displayedColumns = this.displayedColumnsByRange[interval]
      // console.log('this headings have already been stored, they were catched')
      return
    }
    this.renderAndCatchColumns(interval)
  }

  private renderAndCatchColumns(interval: INTERVAL_RANGE_IN_MINUTES) {
    this.timeIntervalService
      .calculateIntervals(interval)
      .pipe(take(1))
      .subscribe((values: Array<IInterval>) => {
        this.displayedColumnsByRange[interval] = values.map(value => value.intervalName)
        this.displayedColumns = this.displayedColumnsByRange[interval]
        //   console.log(`the ${interval} minutes intervals were created`)
      })
  }


  // it organizes the data we get from the mock.
/*  private generateMockDataRows(rowsNumber: number = 4) {
    const obsArray = []
    for (let row = 0; row < rowsNumber; row++) {
      obsArray.push(this.mockDataGenerator.oneMonthData(this.daysInMonth))
    }
    forkJoin(obsArray).subscribe(rows => {
      if (!this.rowsMonthMockData[this.selectedMonth] || regenerateCached) {
        this.rowsMonthMockData[this.selectedMonth] = rows.flat()
        console.log(`data for the month  ${this.selectedMonth + 1} was generated and catched`)
        console.log(this.rowsMonthMockData[this.selectedMonth])
      }
    })
  }*/

  // it generates the unorganized data as if we fetched it from and endpoint or a JSON file
  public generateMockData(regenerateCached = false, rowsNumber: number = 1) {
    const obsArray = []
    console.log('days in month', this.daysInMonth)
    for (let row = 0; row < rowsNumber; row++) {
      obsArray.push(this.mockDataGenerator.oneMonthData(this.daysInMonth, this.selectedMonth))
    }
    combineLatest(obsArray).pipe(take(1)).subscribe(rows => {
      if (!this.rowsMonthMockData[this.selectedMonth] || regenerateCached) {
        this.rowsMonthMockData[this.selectedMonth] = rows
        console.log(`data for the month  ${this.selectedMonth + 1} was generated and catched`)
        console.log(`the data for  ${rowsNumber}  rows was added`)
        console.log(this.rowsMonthMockData[this.selectedMonth])
      }
    })
  }

  private isIntervalAndCatched(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.displayedColumnsByRange[interval]?.length > 0
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
