import {Component, Input, OnInit} from '@angular/core';
import {INTERVAL_RANGE_IN_MINUTES} from "../../../../shared/consts";

export interface Tile {
  color: string
  cols: number
  rows: number
  text: string
}

@Component({
  selector: 'grid-time-interval',
  templateUrl: './grid-time-interval.component.html',
  styleUrls: ['./grid-time-interval.component.scss']
})
export class GridTimeIntervalComponent implements OnInit {

  @Input() dataSource: Array<{}> = []
  @Input() headings: Array<string> = []
  @Input() intervalValue: INTERVAL_RANGE_IN_MINUTES

  public intervalsValues = INTERVAL_RANGE_IN_MINUTES

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ]

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.headings)
    console.log(this.dataSource)

  }

  public isInterval(interval: INTERVAL_RANGE_IN_MINUTES) {
    return this.intervalValue === interval
  }

}
