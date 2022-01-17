import {Component, OnDestroy, OnInit} from '@angular/core'
import {INTERVAL_RANGE_IN_MINUTES, INTERVALS, MONTHS} from '../../shared/consts'
import {FormControl} from '@angular/forms'
import {combineLatest, Observable, of, Subject} from 'rxjs'
import {map, take, takeUntil} from 'rxjs/operators'
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
  public rowsQuantityInMock = 1 // it multiplies the data N times to populate multiple rows and/or months depending on the case
  /*** contains the full value for the headings. start moment, end moment and label
   * Anther solution is to add a pipe to remove the 3rd property label
   * ***/
  public headingIntervalsFullValues: IColumnsByRange = {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: []
  }
  public rowsMonthMockData: any = {}

  public dataSource: Array<Array<{}>> = []
  public intervalsDataSource = new MatTableDataSource<any>([])
  private daysInMonth: number = moment().set({date: 1, month: this.selectedMonth}).daysInMonth()

  constructor(private timeIntervalService: TimeIntervalsService, private mockDataGenerator: MockDataGeneratorService) {
  }

  ngOnInit(): void {
    this.generateMockData()
/*    this.sortMonthData().pipe(takeUntil(this.unsubscribe$)).subscribe( rows => {
      console.log('all the days')
      console.log(rows)
      this.dataSource = rows
    })*/
    this.renderTableData(this.intervalsValues.EVERY_FIVE, this.daysInMonth)
    this.intervalControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(newInterval => {
      this.renderTableData(newInterval, this.daysInMonth)
      // this.intervalsDataSource.data = this.dataSource
    })
    this.monthControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(month => {
      this.selectedMonth = month
      this.daysInMonth = moment().set({date: 1, month: this.selectedMonth}).daysInMonth()
      console.log(this.selectedMonth)
      this.generateMockData()
      this.renderTableData(this.intervalControl.value, this.daysInMonth)
    })
  }

  private renderTableData(interval: INTERVAL_RANGE_IN_MINUTES, daysInMonth: number = 30) {
    this.renderIntervalsHeadings(interval)
    this.renderIntervalRows(interval)
    this.sortData()
  }

  public renderIntervalRows(interval: INTERVAL_RANGE_IN_MINUTES) {
    const rowsObservables = []
    for (let row = 0; row < this.rowsQuantityInMock; row++) {
      rowsObservables.push(this.sortMonthData(interval))
    }
    combineLatest(rowsObservables).pipe(take(1), map( ar => ar.flat() )).subscribe(rows => {
      //console.log(rows[0])
      console.log(rows)
     // this.dataSource = rows
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
    let dayRowsData = this.timeIntervalService.returnSlicedArrayWithAllDays( intervalNumber, this.rowsMonthMockData, this.selectedMonth, this.rowsQuantityInMock)
   // console.log(dayRowsData)
    const allElements = this.rowsMonthMockData[this.selectedMonth]
    //console.log(moment.unix(allElements[287].time).format('DD-MM-YYYY HH:mm'))
   // return dayRowsData
   return this.timeIntervalService.getAllMonthColumnsCompared(this.selectedMonth, interval, this.headingIntervalsFullValues, dayRowsData)
  }
//remove
  public sortData() {
    this.sortInXIntervalsByDay(this.intervalControl.value)
      .pipe(take(1)).subscribe((data) => {
      /* console.log(data.concat(data))
       console.log(this.displayedColumns.length)*/
      this.dataSource = data

    })
  }

  // remove
  public sortInXIntervalsByDay(interval: INTERVAL_RANGE_IN_MINUTES = INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE, selectedDay: number = 1): Observable<any> {
    console.log('sorting')
    //  return new Observable(observable => {
    let randomDay = moment().set('date', selectedDay)
    let dayRowsData: Array<IIntervalData>
    let intervalNumber: number
    if (interval === INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE) {
      intervalNumber = 5
    } else if (interval === INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY) {
      intervalNumber = 30
    } else {
      intervalNumber = 60
    }
    dayRowsData = this.timeIntervalService.returnSlicedArrayByDay(randomDay, intervalNumber, this.rowsMonthMockData, this.selectedMonth, this.rowsQuantityInMock)

    return this.timeIntervalService.getComparedColumns(interval, this.headingIntervalsFullValues, dayRowsData)
  }
  private renderIntervalsHeadings(interval: INTERVAL_RANGE_IN_MINUTES) {
    if (this.isIntervalAndCatched(interval)) {
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
     //   console.log(values)
        this.headingIntervalsFullValues[interval] = values
        this.displayedColumns = values.map(value => value.intervalName)
      })
  }

  // it generates the unorganized data as if we fetched it from and endpoint or a JSON file
  public generateMockData(regenerateCached = false, rowsNumber: number = this.rowsQuantityInMock) {
    const obsArray = []
    if (!this.rowsMonthMockData[this.selectedMonth] || regenerateCached) {
      for (let row = 0; row < rowsNumber; row++) {
        obsArray.push(this.mockDataGenerator.oneMonthData(this.daysInMonth, this.selectedMonth))
      }
      combineLatest(obsArray).pipe(take(1)).subscribe(rows => {
        this.rowsMonthMockData[this.selectedMonth] = rows.flat() // rows.flat()
        this.rowsMonthMockData[this.selectedMonth] = this.rowsMonthMockData[this.selectedMonth].sort(
          (a: IIntervalData, b: IIntervalData) => (a.value < b.value)
        )
      })
    }
  }

  private isIntervalAndCatched(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.headingIntervalsFullValues[interval]?.length > 0
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
