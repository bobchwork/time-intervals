import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { INTERVAL_RANGE_IN_MINUTES } from '../../../../shared/consts'

@Component({
  selector: 'intervals-table',
  templateUrl: './intervals-table.component.html',
  styleUrls: ['./intervals-table.component.scss']
})
export class IntervalsTableComponent implements OnInit {
  @Input() dataSource: Array<{}> = []
  @Input() displayedColumns: Array<string> = []
  @Input() intervalValue: INTERVAL_RANGE_IN_MINUTES

  public intervalsValues = INTERVAL_RANGE_IN_MINUTES

  constructor() {}

  ngOnInit(): void {}

  public isInterval(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.intervalValue === interval
  }
}
