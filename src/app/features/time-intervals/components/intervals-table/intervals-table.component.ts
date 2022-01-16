import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { INTERVAL_RANGE_IN_MINUTES } from '../../../../shared/consts'
import {TimeIntervalsService} from "../../services/time-intervals.service";

@Component({
  selector: 'intervals-table',
  templateUrl: './intervals-table.component.html',
  styleUrls: ['./intervals-table.component.scss']
})
export class IntervalsTableComponent implements OnInit, OnChanges {
  @Input() dataSource: Array<{}> = []
  @Input() displayedColumns: Array<string> = []
  @Input() intervalValue: INTERVAL_RANGE_IN_MINUTES

  public intervalsValues = INTERVAL_RANGE_IN_MINUTES
  rowIndexAc = 0
  currentIndex = 0

  constructor(private timeIntervalService: TimeIntervalsService) {}

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    const t = changes.dataSource.currentValue
  }
  public getInnerRowIndex(i: number) {
    if(i !== this.currentIndex) {
      this.currentIndex = i
    }
    if(this.rowIndexAc === this.displayedColumns.length) {
      this.rowIndexAc = this.currentIndex
    }
    this.rowIndexAc++
    return this.rowIndexAc

  }
  public colToEntry(col:string) {
    return this.timeIntervalService.strToEntry(col)
  }
  public isInterval(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.intervalValue === interval
  }
}
