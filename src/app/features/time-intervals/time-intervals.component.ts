import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import { INTERVAL_RANGE_IN_MINUTES, INTERVALS } from '../../shared/consts'
import { FormControl } from '@angular/forms'
import {BehaviorSubject, Observable, Subject} from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { TimeIntervalsService } from './services/time-intervals.service'
import { IInterval } from '../../shared/interfaces/IInterval'
import {MockDataGeneratorService} from "../../shared/services/mock-data-generator.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";

export interface PeriodicElement {
  name: string
  position: number
  weight: number
  symbol: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }
]

@Component({
  selector: 'time-intervals',
  templateUrl: './time-intervals.component.html',
  styleUrls: ['./time-intervals.component.scss']
})
export class TimeIntervalsComponent implements OnInit, OnDestroy {
  @ViewChild('intervalsTable', {static: false}) table: MatTable<Element>

  public intervals = INTERVALS
  public intervalsValues = INTERVAL_RANGE_IN_MINUTES
  public intervalControl = new FormControl(this.intervalsValues.EVERY_FIVE)
  private unsubscribe$ = new Subject()
  public displayedColumns = ['name', 'position', 'weight', 'symbol', 'star']
  public displayedColumnsByRange: {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: Array<string>
    [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: Array<string>
    [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: Array<string>
  } = {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: [],
    [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: []
  }
  /*  public intervalObjectsArray: {
    [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: Array<IInterval>
     [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: Array<IInterval>
     [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: Array<IInterval>
   } = {
     [INTERVAL_RANGE_IN_MINUTES.EVERY_FIVE]: [],
     [INTERVAL_RANGE_IN_MINUTES.EVERY_THIRTY]: [],
     [INTERVAL_RANGE_IN_MINUTES.EVERY_SIXTY]: []
   }*/
  public dataSource = ELEMENT_DATA
  public intervalsDataSource = new MatTableDataSource<any>([])

  constructor(
    private timeIntervalService: TimeIntervalsService,
    private mockDataGenerator: MockDataGeneratorService
    ) {}

  ngOnInit(): void {
    this.renderIntervalsHeadings(this.intervalsValues.EVERY_FIVE)
    this.intervalControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(newInterval => {
      this.renderIntervalsHeadings(newInterval)
      this.intervalsDataSource.data = this.dataSource
    })
  }

  public isInterval(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.intervalControl.value === interval
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
        this.displayedColumnsByRange[interval] = values.map( value => value.intervalName)
        console.log(this.displayedColumnsByRange[interval] )
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
