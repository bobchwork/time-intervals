import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {INTERVAL_RANGE_IN_MINUTES} from "../../../../shared/consts";

export interface ITile {
  color?: string
  cols?: number
  rows?: number
  text: string
}

@Component({
  selector: 'grid-time-interval',
  templateUrl: './grid-time-interval.component.html',
  styleUrls: ['./grid-time-interval.component.scss']
})
export class GridTimeIntervalComponent implements OnInit, OnChanges {

  @Input() dataSource: Array<Array<any>> = []
  @Input() headings: Array<{}> = []
  @Input() intervalValue: INTERVAL_RANGE_IN_MINUTES

  public intervalsValues = INTERVAL_RANGE_IN_MINUTES
  public dataSourceMainArray = []
  public rowAcc = 0
  public sourceData: any;

  constructor() {
  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.dataSource) {
      this.sourceData = changes.dataSource.currentValue
      console.log(this.sourceData.length)
    }

  }
  public getCellValue(cell: any, i: number) {

    const newCell = Object.values(cell)[this.rowAcc]
    this.rowAcc = this.rowAcc === this.headings.length ? i : this.rowAcc++
    console.log(cell)
    return newCell
  }
  public isInterval(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.intervalValue === interval
  }

}
